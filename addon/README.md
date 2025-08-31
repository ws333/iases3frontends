# 🛸✨🌀 Interstellar Alliance Social Experiment Step 3

<br/>

Interstellar Alliance Social Experiment Step 3 is a Thunderbird add-on to send the Step 3 letter by email to a predefined online contact list.

Based on Thunderbird add-on [Mail Merge P](https://github.com/siefkenj/MailMergeP)

## Building

To build the entire extension, first run

```sh
pnpm install
```

then either

```sh
pnpm run pack
```

or

```sh
pnpm run build
pnpm run build-addon
pnpm run package-addon
```

To bump the version run (before running `pnpm run pack`)

```sh
pnpm run bump
```

The extension will be located in the parent folder of the project with filename `iases3@iase.one.xpi`.
A cleaned and zipped version of the project will also be created in the parent folder of the project when running `pnpm run pack`. This file is required when updating the add-on on https://addons.thunderbird.net

## Development

The project is divided into _npm workspaces_ located in the `packages/` directory.

- `packages/interface` the bulk of the UI code. This code runs in an iframe.
- `packages/iframe-service` an abstraction layer so that the interface can be run in the browser or in Thunderbird.
- `packages/browser-preview` a browser-based implementation of the Thunderbird API, so that the UI can be developed more quickly (with technology like hot-reloading)
- `packages/thunderbird-iframe-service` the connection between the real Thunderbird API and `iframe-service`.
- `packages/thunderbird-extension` the actual extension's `background.js` script.

Most UI and backend work is handled by the HTML components. The `thunderbird-extension` runs the HTML
component in an iframe and uses message passing to communicate with the iframe.

This split means that the bulk of the add-on can be developed in the browser without
Thunderbird.

To run Thunderbird and force a reload of all extension content, launch Thunderbird with

```
thunderbird -purgecaches
```

### Developing the HTML UI

A browser-based simulation of the add-on's Thunderbird API is provided by `packages/browser-preview`.
To develop in the browser first install and build

```sh
pnpm install
pnpm run build
```

Then you can launch a dev server and open it in the browser.

```sh
cd packages/browser-preview
pnpm run dev
```

If you want the interface code to automatically rebuild when you make a change run...

```sh
cd packages/interface
pnpm run watch
```

The UI is developed using React and the Redux based state manager EasyPeasy.

### Packaging

To publish a new version bump the version in `packages/thunderbird-extension/public/manifest.json` and `package.json`.
Then run `pnpm i` to update `package-lock.json`
Then run `pnpm run build-and-package` to build the add-on file.
The resulting `iases3@iase.one.xpi` is a bundle of the extension that can be uploaded to a developer account at https://addons.thunderbird.net/EN-US/developers/

### Contact list sync and merge logic:

- There is a central online contacts list where each contact has a stable unique ID (the uid field).

- Legend for fields modified in frontend:
    - sc = sent count
    - sd = sent date
    - dd = deletion date
    - cf1 = custom field 1
    - cf2 = custom field 2
- Contacts are deleted from the online contacts list when the contact no longer is part of the institution they used to belong to.

- The sc field is incremented and the sd field updated for a contact when the user sends an email to that contact.

- The goal is to keep the local contacts list in sync with the online contacts list while retaining the local stats. The value in sc should always reflect the true sent count to the respective contact, no matter whether the contact is active or deleted. This is accomplished by...
    - Updating all local ContactsI3C fields on app start/refresh except for sd, sc, dd, cf1 and cf2 to retain the local stats.
    - If IndexedDB active contacts contains contacts not in fetched online contacts AND the contact has sc > 0, those contacts are moved from IndexedDB active contacts to IndexedDB deleted contacts, setting field dd to Date.now(), while retaining the other fields.

- The stats are calculated by combining both active and deleted contacts from IndexedDB.

- Exported files contain the date of the export. At import this export date is stored in lastImportExportDate in IndexedDB, this date is then used at the next import to determine how the import is to be applied.

- To sum up the requirements of the logic:
    - The sc stats are to be kept accurate in all possible scenarios, to always reflect the true sent count. _The exception is if there has been sending from multiple devices without exporting and importing sequentially between sending sessions, which would create overlapping stats and skew the sent counts_.
    - Users can:
        - Send emails (increments sc) in multiple sessions
        - Export files in between sending sessions
        - Import any previous export multiple times in between sending sessions
        - Do these actions in any order on one device, but only send emails/export/import in sequence when using multiple devices.

### Other notes

- The state manager used is [easy-peasy](https://easy-peasy.vercel.app/) which is based on Redux. See `packages/interface/src/model.ts`.

- To view more detailed logging, create key "devmode" with value "true" in localStorage
