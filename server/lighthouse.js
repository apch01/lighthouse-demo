import express from 'express';
import cors from 'cors';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
const app = express();
app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
  const { urls, selectedDevice } = req.body;
  const results = [];
  console.log("req.body", req.body)
  try {
    
    const options = {
      logLevel: 'info',
      output: 'json',
      port: chrome.port,
    };

    const deviceWidth = () => {
      if(selectedDevice == 'desktop') return 1280;
      if(selectedDevice == 'mobile') return 480;
    }

    const deviceHeight = () => {
      if(selectedDevice == 'desktop') return 800;
      if(selectedDevice == 'mobile') return 760;
    }

    const config_custom = {
      extends: 'lighthouse:default',
      settings: {
        formFactor: selectedDevice,
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        },
        screenEmulation: {
          mobile: selectedDevice == 'mobile' ? true : false,
          width: deviceWidth(),
          height: deviceHeight(),
          deviceScaleFactor: 1,
          disabled: false
        },
        emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4143.7 Safari/537.36 Chrome-Lighthouse'
      }
    };

    for (const url of urls) {
      try {
        const runnerResult = await lighthouse(url, options, config_custom);
        const { performance, accessibility, seo, 'best-practices': bestPractices } = 
          runnerResult.lhr.categories;

        results.push({
          url,
          selectedDevice,
          scores: {
            performance: performance.score * 100,
            accessibility: accessibility.score * 100,
            seo: seo.score * 100,
            bestPractices: bestPractices.score * 100,
          },
          data: runnerResult,
          success: true,
        });
      } catch (error) {
        results.push({
          url,
          error: error.message,
          success: false
        });
      }
    }
    await res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Lighthouse analysis server running on port 3000');
});