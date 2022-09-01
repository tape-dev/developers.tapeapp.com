---
id: save-jotform-responses-to-tape
title: Connect Jotform to Tape
---

import JotformAutomationTrigger from '@site/static/guide/automations/webhook-jotform/jotform-automation-trigger.png';
import JotformAutomation from '@site/static/guide/automations/webhook-jotform/jotform-automation.png';
import JotformStep1 from '@site/static/guide/automations/webhook-jotform/jotform-step-1.png';
import JotformStep2 from '@site/static/guide/automations/webhook-jotform/jotform-step-2.png';
import MediaFrame from '@site/src/components/media-frame/media-frame.component';

[Jotform](https://jotform.com) is a popular tool for creating online forms. Users can easily create their forms via a drag-and-drop editor. In this guide, we will build a simple workflow to save the responses of a Jotform in Tape using the **webhook trigger**.

## Create a new automation

The first step is to create a new automation in Tape with the **webhook trigger** and to copy the webhook URL:

<MediaFrame><img src={JotformAutomationTrigger} /></MediaFrame>

<br />

Head over to [Jotform](https://jotform.com/) and create your online form with the form builder. Once you are satisfied with your form, you need to register a webhook.

## Register a webhook in Jotform

To register a webhook in Jotform, you need to open the **Settings** tab, select **Integrations** in the left sidebar menu and search for the "webhooks" integration:

<MediaFrame><img src={JotformStep1} /></MediaFrame>

<br />

To complete the integration, paste the Tape webhook URL into the input:

<MediaFrame><img src={JotformStep2} /></MediaFrame>

## Create a new record for each submission

Now that we have set up the Jotform webhook, we can submit a response to our form and head back to the Tape automation. After hitting the "Refresh" button, one variable for each form question will be available inside the automation:

<MediaFrame><img src={JotformAutomation} /></MediaFrame>

<br />

That's it! You can use this guide to connect pretty much any online form provider that offers webhooks.
