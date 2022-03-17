---
id: files
title: Files
sidebar_label: Files
---

# Files

Files have a name, a mime-type, a size and a download link.

Since most files are binary, use `multipart/form-data` instead of JSON when uploading files.

## Uploading Files

When uploading files to Tape, use the dedicated endpoint to create a temporary file reference first:

```
POST https://api.tapeapp.com/files
```

You receive a file reference, that can then be used when creating or updating a resource. See below exaple to attacha file to a single attachment field:

```
{
    "temporaryFileId": "12341234-12341234-12341234",
    "size": 1024,
    downloadUrl: "https://files.tapeapp.com/4312sadfdsa41sdfsdaf324324321413243asfsdf"
}
```
