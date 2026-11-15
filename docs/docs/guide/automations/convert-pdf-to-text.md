# Convert a PDF file to text

> Build an automation that extracts the text of an attached PDF file and saves it in the record's description.

Build an automation that extracts the text of an attached PDF file and saves it in the record's description.

The example uses a task with an attached PDF and an external conversion API.

## Build the automation

The automation has these steps:

1.  **When a record is created:** the automation starts when someone creates a task record.
2.  **Filter:** it continues only if the task's attachment field is not empty. In the screenshot, that field is **PDF output**, so the filter reads **PDF output** **Is not empty**.
3.  **Execute a script:** a script sends the attached file to a conversion API with the `http.upload` function.
4.  The script decodes the base64 response with `Buffer.from` and stores the result in the custom variable **PDF plaintext**.
5.  **Update the current record:** the automation writes the **PDF plaintext** variable to a text field of the task, such as its description. In the screenshot, that field is **Note**.

Steps 3 and 4 need two statements:

```ts
const { data } = await http.upload(
  'https://v2.convertapi.com/convert/pdf/to/txt?Secret=YOUR_SECRET_HERE',
  task_field_attachment_file_url
);

var_pdf_plaintext = Buffer.from(data.Files[0].FileData, 'base64');
```

Replace `YOUR_SECRET_HERE` with the secret of your ConvertAPI account. `http.upload` downloads the file from the URL in its second argument and posts it as the form field `file`. `var_pdf_plaintext` is the [custom variable](https://developers.tapeapp.com/docs/automations/introduction#custom-variables) of the action, named after its label.

The finished automation looks like this:

![The automation editor with the trigger When a record is created, the filter PDF output is not empty, an Execute a script action that saves its output in PDF plaintext, and Update the current record](https://developers.tapeapp.com/assets/images/convert-pdf-to-text-b3c1f972863016385baf6e9bdb5b6944.png)

The name of the file URL variable depends on your app and its attachment field. The code above uses `task_field_attachment_file_url`; the app and field in the screenshot give `hc_test_task_field_pdf_output_file_url`. The editor's [autocompletion](https://help.tapeapp.com/en/articles/18448952-execute-script-action) lists the variables of your app.

The same approach works for other file formats, such as Word documents or PowerPoint presentations. To process the extracted text further, add a conditional action, for example one that assigns a user based on a keyword: "When the PDF contains the word 'legal', assign Juliet."

## Test the automation

Create a task with a PDF attached. After the run, the text of the PDF is in the field you chose in step 5.

## Next steps

[

Automations

where scripts run and what they can do.

](https://developers.tapeapp.com/docs/automations/introduction)[

Automation showcase

more examples with code.

](https://developers.tapeapp.com/docs/guide/automations/automation-showcase)[

Field value

the value format of every field type.

](https://developers.tapeapp.com/docs/api/resource/field-value/overview)
