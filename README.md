# Toxicmetter

Toxicmetter is a cross-platform relationship pattern app for Android, iOS, and
web. It helps users explore relationship signals through guided conversation,
decision trees, exported chats, and screenshots.

The product must avoid clinical or legal verdicts such as "your partner is toxic."
Instead, it should identify patterns, confidence levels, safety signals, and next
steps in plain language.

## Product Modes

1. Real-time chat
   - The user talks with the app and receives guided follow-up questions.
   - Best for users who want to explain their relationship in their own words.

2. Pattern tree
   - The app asks structured questions based on behaviors and frequency.
   - Best for fast, focused analysis and onboarding.

3. Exported chat
   - The user uploads WhatsApp, Telegram, or similar exported chat files.
   - Best for deeper pattern detection across longer conversations.

4. Screenshots and images
   - The user uploads screenshots.
   - OCR extracts text and then the app analyzes the conversation.

5. Not sure where to start
   - The app asks a few triage questions and recommends the best analysis mode.

## Risk Language

Use relationship safety language, not clinical diagnosis.

- Low: common conflict patterns with repair attempts.
- Medium: recurring invalidation, avoidance, blame, or poor repair.
- High: repeated control, intimidation, isolation, humiliation, coercion, or fear.
- Critical: threats, physical violence, stalking, sexual coercion, or immediate danger.

## Safety Principles

- This app is not therapy, legal advice, or emergency support.
- The app should recommend professional support when signals are high risk.
- Crisis and domestic violence resources must be shown when immediate danger is detected.
- Sensitive data must be encrypted, minimized, and easy to delete.
- Users should be able to use the app privately and exit sensitive screens quickly.

## Repository Structure

```text
android/  Native Android beta workspace.
ios/      Native iOS beta workspace.
web/      Web beta workspace.
```

## First Beta Goal

The first beta should prove the core loop:

1. Register or start privately.
2. Choose an analysis mode.
3. Answer questions or upload sample text.
4. Receive a pattern summary with a risk level.
5. See grounded next steps and safety resources.
