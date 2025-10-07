import { NextRequest, NextResponse } from 'next/server';
import { askGemini } from '@/helper/gemini_service';


// Gemini does not require AWS credentials

export async function POST(request: NextRequest) {
  console.log("🚀 Starting TESS exoplanet analysis with Gemini");

  try {
    const data = await request.json();


    const {
      pl_orbper,
      pl_trandurh,
      pl_trandep,
      pl_rade,
      pl_insol,
      pl_eqt,
      st_teff,
      st_logg,
      st_rad,
      st_tmag,
      st_dist,
      ra,
      dec
    } = data;


    const requiredParams = [
      'pl_orbper', 'pl_trandurh', 'pl_trandep', 'pl_rade',
      'pl_insol', 'pl_eqt', 'st_teff', 'st_logg', 'st_rad',
      'st_tmag', 'st_dist', 'ra', 'dec'
    ];

    const missingParams = requiredParams.filter(param => data[param] === undefined || data[param] === null);
    if (missingParams.length > 0) {
      console.log('Missing required parameters:', missingParams);
      return NextResponse.json(
        {
          error: `Missing required parameters: ${missingParams.join(', ')}`,
          success: false
        },
        { status: 400 }
      );
    }



    const prompt = `You are an expert exoplanet astronomer analyzing TESS (Transiting Exoplanet Survey Satellite) mission data. TESS conducts an all-sky survey observing different sectors for ~27 days each, optimized for detecting short-period transiting planets around nearby bright stars. Please analyze the following TESS exoplanet parameters and provide a scientific assessment.

TESS EXOPLANET PARAMETERS:
- Orbital Period: ${pl_orbper} days
- Transit Duration: ${pl_trandurh} hours
- Transit Depth: ${pl_trandep} (fraction of stellar flux blocked)
- Planet Radius: ${pl_rade} Earth radii
- Incident Stellar Flux: ${pl_insol} Earth flux units
- Equilibrium Temperature: ${pl_eqt} K
- Stellar Effective Temperature: ${st_teff} K
- Stellar Surface Gravity: ${st_logg} log(cm/s²)
- Stellar Radius: ${st_rad} Solar radii
- TESS Magnitude: ${st_tmag} mag
- System Distance: ${st_dist} parsecs
- Right Ascension: ${ra} degrees
- Declination: ${dec} degrees

TESS MISSION CONTEXT:
- All-sky survey with 27-day observation periods per sector
- Optimized for nearby bright stars (TESS magnitude < 15)
- Focus on short-period planets (P < 50 days) for high detection efficiency
- Excellent photometric precision for bright stars
- Two-minute cadence for priority targets, 30-minute for full frame images
- Primary mission covers 85% of the sky

ANALYSIS CRITERIA FOR TESS:
1. Detection Quality: Transit depth > 0.0001 and duration 0.5-12 hours indicates genuine transit
2. Stellar Brightness: TESS magnitude < 12 indicates excellent photometric precision
3. Planetary Size: 0.5-4.0 Earth radii suggests rocky to sub-Neptune planets (>20 R⊕ suggests contamination)
4. Orbital Characteristics: Period 0.5-100 days optimal for TESS detection
5. Temperature Range: 100-3000K covers full range from frozen to ultra-hot planets
6. Physical Consistency: Stellar parameters consistent with main sequence evolution
7. Signal Quality: Short periods with deep transits favor reliable detection
8. System Distance: <200 pc ideal for follow-up observations and mass measurements

HABITABILITY ASSESSMENT:
- Potentially Habitable: 200-350K equilibrium temperature, 0.8-1.5 Earth radii, temperate zone
- Warm Zone: 350-600K, possibly habitable with right atmospheric conditions
- Hot Zone: 600-1500K, too hot for conventional liquid water
- Ultra-Hot: >1500K, likely tidally locked with extreme day-night temperature contrast
- Cold Zone: <200K, frozen without substantial greenhouse atmosphere

PLANET TYPE CLASSIFICATION:
- Earth-like: 0.8-1.25 R⊕, rocky composition, potentially habitable
- Super-Earth: 1.25-2.0 R⊕, likely rocky with thick atmosphere
- Sub-Neptune: 2.0-4.0 R⊕, substantial H/He envelope, mini gas giant
- Neptune-size: 4.0-8.0 R⊕, ice giant or gas giant
- Jupiter-size: >8.0 R⊕, gas giant with extensive atmosphere

REQUIRED OUTPUT FORMAT (respond with EXACTLY this JSON structure):
{
  "disposition": "PC" | "CP" | "FP" | "APC" | "KP",
  "confidence": [number between 0.0 and 1.0],
  "reasoning": "[detailed scientific explanation of the TESS analysis]",
  "is_exoplanet": [boolean: true if PC/CP/APC/KP, false if FP],
  "planet_type": "[classification: Earth-like, Super-Earth, Sub-Neptune, Neptune-size, or Jupiter-size]"
}

TESS DISPOSITION CLASSIFICATIONS (use these exact values):
- PC (Planetary Candidate): Strong evidence for a planetary signal, needs follow-up
- CP (Confirmed Planet): Definitive evidence of an exoplanet through follow-up observations
- FP (False Positive): Signal determined to be astrophysical false positive (eclipsing binary, etc.)
- APC (Ambiguous Planetary Candidate): Weak or uncertain evidence, requires more analysis
- KP (Known Planet): Previously discovered planet re-detected by TESS

Consider TESS-specific factors such as:
- Short observation baseline requiring strong transit signals
- Contamination from nearby stars in large TESS pixels
- Systematic noise from scattered light and instrumental effects
- Need for ground-based follow-up for orbital confirmation
- Potential false positives from stellar activity, binary stars, or background eclipsing binaries
- TESS magnitude limits affecting photometric precision

Based on your scientific analysis of these TESS mission parameters, what is your assessment?`;

    console.log('🤖 Sending TESS exoplanet data to Gemini for analysis...');
    const responseText = await askGemini(prompt);

    if (!responseText) {
      console.log('❌ No response text from Gemini');
      throw new Error('No response from Gemini');
    }

    console.log('🧠 Gemini TESS Analysis response length:', responseText.length);
    console.log('📝 Gemini response preview:', responseText.substring(0, 200) + '...');

    try {
      // Clean the response text to extract JSON from markdown code blocks
      let cleanedResponse = responseText.trim();
      
      // Remove markdown code blocks if present
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const analysisResult = JSON.parse(cleanedResponse);


      if (!analysisResult.disposition || !analysisResult.confidence || !analysisResult.reasoning) {
        throw new Error('Invalid response format from Gemini');
      }


      const validDispositions = ['PC', 'CP', 'FP', 'APC', 'KP'];
      if (!validDispositions.includes(analysisResult.disposition)) {
        analysisResult.disposition = 'PC';
      }

      analysisResult.confidence = Math.max(0.0, Math.min(1.0, analysisResult.confidence));

      return NextResponse.json({
        disposition: analysisResult.disposition,
        confidence: analysisResult.confidence,
        reasoning: analysisResult.reasoning,
        is_exoplanet: analysisResult.is_exoplanet !== undefined ? analysisResult.is_exoplanet : (analysisResult.disposition !== 'FP'),
        planet_type: analysisResult.planet_type || 'Unknown',
        mission: 'TESS',
        ai_analysis: true,
        parameters_analyzed: {
          pl_orbper,
          pl_trandurh,
          pl_trandep,
          pl_rade,
          pl_insol,
          pl_eqt,
          st_teff,
          st_logg,
          st_rad,
          st_tmag,
          st_dist,
          ra,
          dec
        }
      });

    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.log('Raw Gemini response:', responseText);


      let disposition = 'PC';
      const lowText = responseText.toLowerCase();

      if (lowText.includes('confirmed') || lowText.includes(' cp ')) {
        disposition = 'CP';
      } else if (lowText.includes('false positive') || lowText.includes(' fp ')) {
        disposition = 'FP';
      } else if (lowText.includes('ambiguous') || lowText.includes(' apc ')) {
        disposition = 'APC';
      } else if (lowText.includes('known planet') || lowText.includes(' kp ')) {
        disposition = 'KP';
      } else if (lowText.includes('candidate') || lowText.includes(' pc ')) {
        disposition = 'PC';
      }

      return NextResponse.json({
        disposition,
        confidence: 0.5,
        reasoning: responseText,
        mission: 'TESS',
        ai_analysis: true,
        parse_error: true,
        parameters_analyzed: {
          pl_orbper,
          pl_trandurh,
          pl_trandep,
          pl_rade,
          pl_insol,
          pl_eqt,
          st_teff,
          st_logg,
          st_rad,
          st_tmag,
          st_dist,
          ra,
          dec
        }
      });
    }

  } catch (error) {
    console.error('Error in TESS exoplanet prediction API:', error);

    if (error instanceof Error && error.message.includes('credential')) {
      return NextResponse.json(
        {
          error: 'AWS credentials error. Please check your AWS configuration.',
          success: false
        },
        { status: 401 }
      );
    }


    if (error instanceof Error && error.message.includes('access')) {
      return NextResponse.json(
        {
          error: 'Gemini model access denied. Please check your API permissions.',
          success: false
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to get TESS prediction from Gemini AI',
        success: false
      },
      { status: 500 }
    );
  }
}