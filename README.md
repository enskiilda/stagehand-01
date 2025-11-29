# 🤘 Welcome to Stagehand Next.js!

Hey! This is a Next.js project built with [Stagehand](https://github.com/browserbase/stagehand).

You can build your own web agent using: `npx create-browser-app`!

## Setting the Stage

Stagehand is an SDK for automating browsers. It's built on top of [Playwright](https://playwright.dev/) and provides a higher-level API for better debugging and AI fail-safes.

This project uses [Kernel](https://onkernel.com) for cloud browser automation and [Groq](https://groq.com) with the `moonshotai/kimi-k2-instruct` model for AI-powered browser interactions.

## Curtain Call

Get ready for a show-stopping development experience. Just run:

```bash
npm install && npm run dev
```

## What's Next?

### Add your API keys

This project uses Groq for AI and Kernel for cloud browsers. You'll need to set up the following environment variables:

```bash
cp .example.env .env # Add your API keys to .env
```

Required environment variables:
- `KERNEL_API_KEY` - Your Kernel API key for cloud browsers
- `GROQ_API_KEY` - Your Groq API key for the AI model

### Custom .cursorrules

We have custom .cursorrules for this project. It'll help quite a bit with writing Stagehand easily.

### Cloud Browser with Kernel

This project is configured to use Kernel's cloud browsers via CDP URL. The configuration in [stagehand.config.ts](stagehand.config.ts) sets `env: "LOCAL"` with `localBrowserLaunchOptions.cdpUrl` pointing to Kernel's browser session.

### Using the Groq AI Model

The project uses `groq/moonshotai/kimi-k2-instruct` as the AI model. To change the model, edit the `modelName` in [stagehand.config.ts](stagehand.config.ts).
