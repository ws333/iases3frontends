# 🛸✨🌀 Interstellar Alliance Social Experiment Step 3

<br/>

Frontends for a Interstellar Alliance Social Experiment Step 3 project aimed at making sending of the Step 3 letter by email more conventient.
They use a predefined online contact list that is updated on a regular basis.

More on the overall experiment 
https://www.bashar.org/socialexperiment

<br>

## This repo includes...


- A Thunderbird addon which supports using any email account for sending the Step 3 letter. \
  [See README in folder addon](addon/)

- A standalone webapp using the same user interface as the Thunderbird addon,
  but simplifies the setup if using a Google Gmail or Microsoft Outlook account. \
  [See README in folder webapp](webapp/)

<br>

## Contact list sync and merge logic

- There is a central online contacts list where each contact has a stable unique id (the uid field).

- Legend for fields modified in frontend:
    - sc = sent count
    - sd = sent date
    - dd = deletion date
    - cf1 = custom field 1
    - cf2 = custom field 2
- Contacts are deleted from the online contacts list when the contact no longer is part of the institution they used to belong to.

- The sc field is incremented and the sd field updated for a contact when the user sends an email to that contact.

- The goal is to keep the local contacts list in sync with the online contacts list while retaining the local stats. I.e. sc should always reflect the true sent count to the respective contact, no matter if the contact is active or deleted. This is accomplished by...

    - Updating all local ContactsI3C fields on app start/refresh expect for sd, sc, dd, cf1 and cf2 to retain the local stats.
    - If IndexedDB active contacts contains contacts not in fetched online contacts AND the contact has sc > 0, those contacts are moved from IndexedDB active contacts to IndexedDB deleted contacts, setting field dd to Date.now(), while retaining the other fields.

- The stats are calculated by combining both active and deleted contacts from IndexedDB.

- Exported files contain the date of the export. At import this export date is stored in lastImportExportDate in IndexedDB, this date is then used at the next import to determine how the import is to be applied.

- To sum up the requirements of the logic:

    - The sc stats are to be kept accurate in all possible scenarios, i.e. always reflect the true sent count. _The exception is if there has been sending from multiple devices without exporting and importing sequentially between sending sessions, which would create overlapping stats and scew the sent counts_.
    - Users can:

        - Send emails (i.e. increment sc) in multiple sessions
        - Export files in between sending sessions
        - Import any previous export multiple times in between sending sessions
        - Do these actions in any order on one device, but only send emails/export/import in sequence when using multiple devices.

## Other notes

- To view more detailed logging create key "devmode" with value "1" in localStorage
