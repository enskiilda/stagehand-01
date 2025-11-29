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

// Helper function to create a Kernel browser session
async function createKernelBrowser() {
  const kernel = new Kernel();
  const kernelBrowser = await kernel.browsers.create({ stealth: true });
  return { kernel, kernelBrowser };
}

// Helper function to cleanup Kernel browser session
async function cleanupKernelBrowser(kernel: Kernel, sessionId: string) {
  await kernel.browsers.deleteByID(sessionId);
}

export async function runStagehand(cdpUrl?: string, sessionId?: string) {
  let kernel: Kernel | null = null;
  let localSessionId: string | null = null;
  let localCdpUrl: string = cdpUrl || "";
  
  try {
    // If no CDP URL provided, create a new browser session
    if (!cdpUrl) {
      const result = await createKernelBrowser();
      kernel = result.kernel;
      localCdpUrl = result.kernelBrowser.cdp_ws_url;
      localSessionId = result.kernelBrowser.session_id;
    }
    
    const stagehand = new Stagehand({
      ...StagehandConfig,
      localBrowserLaunchOptions: {
        cdpUrl: localCdpUrl,
      },
    });
    
    await stagehand.init();
    // Note: main() handles closing stagehand internally
    await main({ page: stagehand.page, context: stagehand.context, stagehand });
  } finally {
    // Clean up Kernel browser if we created it
    if (kernel && localSessionId) {
      await cleanupKernelBrowser(kernel, localSessionId);
    } else if (sessionId) {
      // Clean up the session passed to us
      const cleanupKernel = new Kernel();
      await cleanupKernelBrowser(cleanupKernel, sessionId);
    }
  }
}

export async function startKernelSession() {
  const { kernelBrowser } = await createKernelBrowser();
  
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
