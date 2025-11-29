/**
 * 🤘 Welcome to Stagehand!
 *
 * This is the server-side entry point for Stagehand.
 *
 * To edit the Stagehand script, see `api/stagehand/main.ts`.
 * To edit config, see `stagehand.config.ts`.
 *
 * In this quickstart, we'll be automating a browser session to show you the power of Playwright and Stagehand's AI features.
 * 
 * Using Kernel's cloud browser for browser automation.
 */
"use server";

import StagehandConfig from "@/stagehand.config";
import Kernel from "@onkernel/sdk";
import { Stagehand } from "@browserbasehq/stagehand";
import { main } from "./main";

export async function runStagehand() {
  const kernel = new Kernel();
  
  // Create a cloud browser session with Kernel
  const kernelBrowser = await kernel.browsers.create({ stealth: true });
  
  console.log("Live view url: ", kernelBrowser.browser_live_view_url);
  
  const stagehand = new Stagehand({
    ...StagehandConfig,
    localBrowserLaunchOptions: {
      cdpUrl: kernelBrowser.cdp_ws_url,
    },
  });
  
  await stagehand.init();
  await main({ page: stagehand.page, context: stagehand.context, stagehand });
  await stagehand.close();
  
  // Clean up Kernel browser
  await kernel.browsers.deleteByID(kernelBrowser.session_id);
}

export async function startKernelSession() {
  const kernel = new Kernel();
  const kernelBrowser = await kernel.browsers.create({ stealth: true });
  
  return {
    sessionId: kernelBrowser.session_id,
    debugUrl: kernelBrowser.browser_live_view_url,
    cdpUrl: kernelBrowser.cdp_ws_url,
  };
}

export async function getConfig() {
  const hasKernelCredentials = process.env.KERNEL_API_KEY !== undefined;

  const hasLLMCredentials = process.env.GROQ_API_KEY !== undefined;

  return {
    env: StagehandConfig.env,
    debugDom: StagehandConfig.debugDom,
    headless: StagehandConfig.headless,
    domSettleTimeoutMs: StagehandConfig.domSettleTimeoutMs,
    hasKernelCredentials,
    hasLLMCredentials,
  };
}
