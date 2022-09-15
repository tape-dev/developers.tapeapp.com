---
id: save-google-form-responses-to-tape
title: Connect Google Forms to Tape
---

import GoogleFormsAutomationTrigger from '@site/static/guide/automations/webhook-google-forms/google-forms-automation-trigger.png';
import GoogleFormsAutomation from '@site/static/guide/automations/webhook-google-forms/google-forms-automation.png';
import GoogleFormsStep1 from '@site/static/guide/automations/webhook-google-forms/google-forms-step-1.png';
import GoogleFormsStep2 from '@site/static/guide/automations/webhook-google-forms/google-forms-step-2.png';
import GoogleFormsStep3 from '@site/static/guide/automations/webhook-google-forms/google-forms-step-3.png';
import GoogleFormsStep4 from '@site/static/guide/automations/webhook-google-forms/google-forms-step-4.png';
import MediaFrame from '@site/src/components/media-frame/media-frame.component';

[Google Forms](https://www.google.com/forms/about/) is a popular tool for creating online forms and surveys. Users can easily create their forms via a drag-and-drop editor. In this guide, we will build a simple workflow to save the responses of a Google form in Tape using the **webhook trigger**.

## Create a new automation

The first step is to create a new automation in Tape with the **webhook trigger** and to copy the webhook URL:

<MediaFrame><img src={GoogleFormsAutomationTrigger} /></MediaFrame>

<br />

Head over to [Google Forms](https://www.google.com/forms/) and create your online form with the form builder. Once you are satisfied with your form, you need to register a webhook.

## Register a webhook in Google Forms

To register a webhook in Google Forms, you need to open the **Script editor** from the settings:

<MediaFrame><img src={GoogleFormsStep1} /></MediaFrame>

<br />

Once you opened the script editor, replace `https://tapeapp.com/api/catch/YOUR_WEBHOOK_URL_HERE` with the URL of your webhook trigger in the code below and copy&paste the resulting code into the editor:

```js
var POST_URL = 'https://tapeapp.com/api/catch/YOUR_WEBHOOK_URL_HERE';
function onSubmit(e) {
  var form = FormApp.getActiveForm();
  var allResponses = form.getResponses();
  var latestResponse = allResponses[allResponses.length - 1];
  var response = latestResponse.getItemResponses();
  var payload = {};
  for (var i = 0; i < response.length; i++) {
    var question = response[i]
      .getItem()
      .getTitle()
      .replace(/[^a-zA-Z0-9]/g, '_');
    var answer = response[i].getResponse();
    payload[question] = answer;
  }

  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  };
  UrlFetchApp.fetch(POST_URL, options);
}
```

<MediaFrame><img src={GoogleFormsStep2} /></MediaFrame>

<br />

Hit the save icon and the **Deploy** button to activate your webhook script. You might need to grant permissions to yourself under the "Advanced" option:

<MediaFrame><img src={GoogleFormsStep3} /></MediaFrame>

<br />

Lastly, you have to create a Google Forms Trigger under the **Triggers** menu option on the left. Choose "onSubmit", "Head", "From form" and "On form submit" as the options:

<MediaFrame><img src={GoogleFormsStep4} /></MediaFrame>

<br />

## Create a new record for each submission

Now that we have set up the Google forms webhook, we can submit a response to our form and head back to the Tape automation. After hitting the "Refresh" button, one variable for each form question will be available inside the automation:

<MediaFrame><img src={GoogleFormsAutomation} /></MediaFrame>

<br />

That's it! You can use this guide to connect pretty much any online form provider that offers webhooks (and hofepully makes them easier to set up...).
