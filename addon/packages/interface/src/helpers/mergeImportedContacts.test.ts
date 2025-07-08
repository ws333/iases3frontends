import { describe, expect, it } from "vitest";
import { ContactI3C, ImportData } from "../types/typesI3C";
import { ContactState, deleteContact, mergeImportedContacts } from "./mergeImportedContacts";

describe("mergeImportedContacts", () => {
    const emptyState: ContactState = { active: [], deleted: [], lastImportExportDate: 0 };

    const createImport = (
        activeContacts: Partial<ImportData["contacts"]["active"][0]>[],
        deletedContacts: Partial<ImportData["contacts"]["deleted"][0]>[],
        exportDate: number,
        lastImportExportDate: number = exportDate - 1000
    ): ImportData => ({
        contacts: {
            active: activeContacts.map((c) => ({
                uid: c.uid!,
                sd: c.sd!,
                sc: c.sc!,
                cf1: c.cf1 || "",
                cf2: c.cf2 || "",
            })),
            deleted: deletedContacts.map((c) => ({
                uid: c.uid!,
                sd: c.sd!,
                sc: c.sc!,
                dd: c.dd!,
                cf1: c.cf1 || "",
                cf2: c.cf2 || "",
            })),
        },
        metadata: [
            { key: "exportDate", value: exportDate },
            { key: "lastImportExportDate", value: lastImportExportDate },
        ],
    });

    const expectContactMatch = (actual: ContactI3C, expected: Partial<ContactI3C>) => {
        expect({
            ...actual,
            na: undefined,
            i: undefined,
            s: undefined,
            n: undefined,
            e: undefined,
            ud: undefined,
            cb1: undefined,
            cb2: undefined,
        }).toMatchObject({
            ...expected,
            na: undefined,
            i: undefined,
            s: undefined,
            n: undefined,
            e: undefined,
            ud: undefined,
            cb1: undefined,
            cb2: undefined,
        });
    };

    it("handles clean import (new contact added to deleted)", () => {
        const importData = createImport(
            [
                {
                    uid: 1672531200000,
                    sc: 3,
                    sd: 1677600000000,
                    cf1: "CF1",
                    cf2: "CF2",
                },
            ],
            [],
            1677590000000
        );
        const [result, stats] = mergeImportedContacts(emptyState, importData);
        expect(result.active).toEqual([]);
        expect(result.deleted.length).toBe(1);
        expectContactMatch(result.deleted[0], {
            uid: 1672531200000,
            sc: 3,
            sd: 1677600000000,
            cf1: "CF1",
            cf2: "CF2",
            dd: 1677590000000,
        });
        expect(result.lastImportExportDate).toBe(1677590000000);
        expect(stats).toEqual({ contactsDeleted: 1, contactsProcessed: 1 });
    });

    it("handles send after export", () => {
        const initialState: ContactState = {
            active: [
                {
                    uid: 1672531200000,
                    na: "US",
                    i: "TestInst",
                    s: "TestGroup",
                    n: "Test",
                    e: "test@example.com",
                    sc: 4,
                    sd: 1677686400000,
                    ud: "2023-01-01T00:00:00Z",
                    dd: 0,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "CF1",
                    cf2: "CF2",
                },
            ],
            deleted: [],
            lastImportExportDate: 1677590000000,
        };
        const importData = createImport(
            [
                {
                    uid: 1672531200000,
                    sc: 3,
                    sd: 1677600000000,
                    cf1: "CF1-updated",
                    cf2: "CF2-updated",
                },
            ],
            [],
            1677590000000
        );
        const [result, stats] = mergeImportedContacts(initialState, importData);
        expectContactMatch(result.active[0], {
            sc: 4,
            sd: 1677686400000,
            cf1: "CF1",
            cf2: "CF2",
            dd: 0,
        });
        expect(result.lastImportExportDate).toBe(1677590000000);
        expect(stats).toEqual({ contactsDeleted: 0, contactsProcessed: 1 });
    });

    it("handles send before import", () => {
        const initialState: ContactState = {
            active: [
                {
                    uid: 1672531200000,
                    na: "US",
                    i: "TestInst",
                    s: "TestGroup",
                    n: "Test",
                    e: "test@example.com",
                    sc: 2,
                    sd: 1677686400000,
                    ud: "2023-01-01T00:00:00Z",
                    dd: 0,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "CF1",
                    cf2: "CF2",
                },
            ],
            deleted: [],
            lastImportExportDate: 1677580000000,
        };
        const importData = createImport(
            [
                {
                    uid: 1672531200000,
                    sc: 3,
                    sd: 1677600000000,
                    cf1: "CF1-updated",
                    cf2: "CF2-updated",
                },
            ],
            [],
            1677590000000
        );
        const [result, stats] = mergeImportedContacts(initialState, importData);
        expectContactMatch(result.active[0], {
            sc: 5,
            sd: 1677686400000,
            cf1: "CF1-updated",
            cf2: "CF2-updated",
            dd: 0,
        });
        expect(result.lastImportExportDate).toBe(1677590000000);
        expect(stats).toEqual({ contactsDeleted: 0, contactsProcessed: 1 });
    });

    it("handles multiple imports", () => {
        const initialState: ContactState = {
            active: [
                {
                    uid: 1672531200000,
                    na: "US",
                    i: "TestInst",
                    s: "TestGroup",
                    n: "Test",
                    e: "test@example.com",
                    sc: 3,
                    sd: 1677600000000,
                    ud: "2023-01-01T00:00:00Z",
                    dd: 0,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "CF1",
                    cf2: "CF2",
                },
            ],
            deleted: [],
            lastImportExportDate: 1677590000000,
        };
        const importData = createImport(
            [
                {
                    uid: 1672531200000,
                    sc: 3,
                    sd: 1677600000000,
                    cf1: "CF1-updated",
                    cf2: "CF2-updated",
                },
            ],
            [],
            1677590000000
        );
        const [result1, stats1] = mergeImportedContacts(initialState, importData);
        const [result2, stats2] = mergeImportedContacts(result1, importData);
        expectContactMatch(result2.active[0], {
            sc: 3,
            sd: 1677600000000,
            cf1: "CF1",
            cf2: "CF2",
            dd: 0,
        });
        expect(result2.lastImportExportDate).toBe(1677590000000);
        expect(stats1).toEqual({ contactsDeleted: 0, contactsProcessed: 1 });
        expect(stats2).toEqual({ contactsDeleted: 0, contactsProcessed: 1 });
    });

    it("handles deleted contact with no new sends", () => {
        const initialState = deleteContact(
            {
                active: [
                    {
                        uid: 1672531200000,
                        na: "US",
                        i: "TestInst",
                        s: "TestGroup",
                        n: "Test",
                        e: "test@example.com",
                        sc: 3,
                        sd: 1677600000000,
                        ud: "2023-01-01T00:00:00Z",
                        dd: 0,
                        cb1: "CB1",
                        cb2: "CB2",
                        cf1: "CF1",
                        cf2: "CF2",
                    },
                ],
                deleted: [],
                lastImportExportDate: 1677590000000,
            },
            1672531200000,
            1677610000000
        );
        const importData = createImport(
            [],
            [
                {
                    uid: 1672531200000,
                    sc: 3,
                    sd: 1677600000000,
                    dd: 1677610000000,
                    cf1: "CF1-updated",
                    cf2: "CF2-updated",
                },
            ],
            1677590000000
        );
        const [result, stats] = mergeImportedContacts(initialState, importData);
        expect(result.active).toEqual([]);
        expectContactMatch(result.deleted[0], {
            sc: 3,
            sd: 1677600000000,
            dd: 1677610000000,
            cf1: "CF1",
            cf2: "CF2",
        });
        expect(result.lastImportExportDate).toBe(1677590000000);
        expect(stats).toEqual({ contactsDeleted: 0, contactsProcessed: 1 });
    });

    it("handles sends and deletions after export", () => {
        const initialState: ContactState = {
            active: [],
            deleted: [
                {
                    uid: 1672531200000,
                    na: "US",
                    i: "TestInst",
                    s: "TestGroup",
                    n: "Test",
                    e: "test@example.com",
                    sc: 4,
                    sd: 1677686400000,
                    dd: 1677610000000,
                    ud: "2023-01-01T00:00:00Z",
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "CF1",
                    cf2: "CF2",
                },
            ],
            lastImportExportDate: 1677590000000,
        };
        const importData = createImport(
            [],
            [
                {
                    uid: 1672531200000,
                    sc: 3,
                    sd: 1677600000000,
                    dd: 1677610000000,
                    cf1: "CF1-updated",
                    cf2: "CF2-updated",
                },
            ],
            1677590000000
        );
        const [result, stats] = mergeImportedContacts(initialState, importData);
        expect(result.active).toEqual([]);
        expectContactMatch(result.deleted[0], {
            sc: 4,
            sd: 1677686400000,
            dd: 1677610000000,
            cf1: "CF1",
            cf2: "CF2",
        });
        expect(result.lastImportExportDate).toBe(1677590000000);
        expect(stats).toEqual({ contactsDeleted: 0, contactsProcessed: 1 });
    });

    it("handles older import for active contact (no change)", () => {
        const initialState: ContactState = {
            active: [
                {
                    uid: 1672531200000,
                    na: "US",
                    i: "TestInst",
                    s: "TestGroup",
                    n: "Test",
                    e: "test@example.com",
                    sc: 4,
                    sd: 1677686400000,
                    ud: "2023-01-01T00:00:00Z",
                    dd: 0,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "CF1",
                    cf2: "CF2",
                },
            ],
            deleted: [],
            lastImportExportDate: 1677590000000,
        };
        const importData = createImport(
            [
                {
                    uid: 1672531200000,
                    sc: 3,
                    sd: 1677600000000,
                    cf1: "CF1-updated",
                    cf2: "CF2-updated",
                },
            ],
            [],
            1677580000000
        );
        const [result, stats] = mergeImportedContacts(initialState, importData);
        expectContactMatch(result.active[0], {
            sc: 4,
            sd: 1677686400000,
            cf1: "CF1",
            cf2: "CF2",
            dd: 0,
        });
        expect(result.lastImportExportDate).toBe(1677590000000);
        expect(stats).toEqual({ contactsDeleted: 0, contactsProcessed: 1 });
    });

    it("handles older import for deleted contact (no change)", () => {
        const initialState: ContactState = {
            active: [],
            deleted: [
                {
                    uid: 1672531200000,
                    na: "US",
                    i: "TestInst",
                    s: "TestGroup",
                    n: "Test",
                    e: "test@example.com",
                    sc: 4,
                    sd: 1677686400000,
                    dd: 1677610000000,
                    ud: "2023-01-01T00:00:00Z",
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "CF1",
                    cf2: "CF2",
                },
            ],
            lastImportExportDate: 1677590000000,
        };
        const importData = createImport(
            [],
            [
                {
                    uid: 1672531200000,
                    sc: 3,
                    sd: 1677600000000,
                    dd: 1677610000000,
                    cf1: "CF1-updated",
                    cf2: "CF2-updated",
                },
            ],
            1677580000000
        );
        const [result, stats] = mergeImportedContacts(initialState, importData);
        expectContactMatch(result.deleted[0], {
            sc: 4,
            sd: 1677686400000,
            dd: 1677610000000,
            cf1: "CF1",
            cf2: "CF2",
        });
        expect(result.lastImportExportDate).toBe(1677590000000);
        expect(stats).toEqual({ contactsDeleted: 0, contactsProcessed: 1 });
    });

    it("handles multiple contacts in single import", () => {
        const initialState: ContactState = {
            active: [
                {
                    uid: 1672531200000,
                    na: "US",
                    i: "TestInst",
                    s: "TestGroup",
                    n: "Test1",
                    e: "test1@example.com",
                    sc: 2,
                    sd: 1677686400000,
                    ud: "2023-01-01T00:00:00Z",
                    dd: 0,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "CF1",
                    cf2: "CF2",
                },
            ],
            deleted: [
                {
                    uid: 1672531200001,
                    na: "US",
                    i: "TestInst",
                    s: "TestGroup",
                    n: "Test2",
                    e: "test2@example.com",
                    sc: 3,
                    sd: 1677600000000,
                    dd: 1677610000000,
                    ud: "2023-01-01T00:00:00Z",
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "CF1",
                    cf2: "CF2",
                },
            ],
            lastImportExportDate: 1677580000000,
        };
        const importData = createImport(
            [
                {
                    uid: 1672531200000,
                    sc: 3,
                    sd: 1677600000000,
                    cf1: "CF1-updated",
                    cf2: "CF2-updated",
                },
            ],
            [
                {
                    uid: 1672531200001,
                    sc: 5,
                    sd: 1677606400000,
                    dd: 1677610000000,
                    cf1: "CF1-new",
                    cf2: "CF2-new",
                },
            ],
            1677590000000
        );
        const [result, stats] = mergeImportedContacts(initialState, importData);
        expectContactMatch(result.active[0], {
            uid: 1672531200000,
            sc: 5,
            sd: 1677686400000,
            cf1: "CF1-updated",
            cf2: "CF2-updated",
            dd: 0,
        });
        expectContactMatch(result.deleted[0], {
            uid: 1672531200001,
            sc: 5,
            sd: 1677606400000,
            cf1: "CF1-new",
            cf2: "CF2-new",
            dd: 1677610000000,
        });
        expect(result.lastImportExportDate).toBe(1677590000000);
        expect(stats).toEqual({ contactsDeleted: 0, contactsProcessed: 2 });
    });

    it("handles empty import (no change)", () => {
        const initialState: ContactState = {
            active: [
                {
                    uid: 1672531200000,
                    na: "US",
                    i: "TestInst",
                    s: "TestGroup",
                    n: "Test",
                    e: "test@example.com",
                    sc: 3,
                    sd: 1677600000000,
                    ud: "2023-01-01T00:00:00Z",
                    dd: 0,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "CF1",
                    cf2: "CF2",
                },
            ],
            deleted: [],
            lastImportExportDate: 1677590000000,
        };
        const importData = createImport([], [], 1677600000000);
        const [result, stats] = mergeImportedContacts(initialState, importData);
        expectContactMatch(result.active[0], {
            sc: 3,
            sd: 1677600000000,
            cf1: "CF1",
            cf2: "CF2",
            dd: 0,
        });
        expect(result.deleted).toEqual([]);
        expect(result.lastImportExportDate).toBe(1677600000000);
        expect(stats).toEqual({ contactsDeleted: 0, contactsProcessed: 0 });
    });

    it("handles import with missing contact (new deleted entry)", () => {
        const initialState: ContactState = {
            active: [
                {
                    uid: 1672531200000,
                    na: "US",
                    i: "TestInst",
                    s: "TestGroup",
                    n: "Test",
                    e: "test@example.com",
                    sc: 3,
                    sd: 1677600000000,
                    ud: "2023-01-01T00:00:00Z",
                    dd: 0,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "CF1",
                    cf2: "CF2",
                },
            ],
            deleted: [],
            lastImportExportDate: 1677590000000,
        };
        const importData = createImport(
            [
                {
                    uid: 1672531200001,
                    sc: 2,
                    sd: 1677620000000,
                    cf1: "CF1-new",
                    cf2: "CF2-new",
                },
            ],
            [],
            1677600000000
        );
        const [result, stats] = mergeImportedContacts(initialState, importData);
        expectContactMatch(result.active[0], {
            uid: 1672531200000,
            sc: 3,
            sd: 1677600000000,
            cf1: "CF1",
            cf2: "CF2",
            dd: 0,
        });
        expectContactMatch(result.deleted[0], {
            uid: 1672531200001,
            sc: 2,
            sd: 1677620000000,
            cf1: "CF1-new",
            cf2: "CF2-new",
            dd: 1677600000000,
        });
        expect(result.lastImportExportDate).toBe(1677600000000);
        expect(stats).toEqual({ contactsDeleted: 1, contactsProcessed: 1 });
    });

    it("handles simultaneous active and deleted updates", () => {
        const initialState: ContactState = {
            active: [
                {
                    uid: 1672531200000,
                    na: "US",
                    i: "TestInst",
                    s: "TestGroup",
                    n: "Test1",
                    e: "test1@example.com",
                    sc: 2,
                    sd: 1677600000000,
                    ud: "2023-01-01T00:00:00Z",
                    dd: 0,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "CF1",
                    cf2: "CF2",
                },
            ],
            deleted: [
                {
                    uid: 1672531200001,
                    na: "US",
                    i: "TestInst",
                    s: "TestGroup",
                    n: "Test2",
                    e: "test2@example.com",
                    sc: 3,
                    sd: 1677600000000,
                    dd: 1677610000000,
                    ud: "2023-01-01T00:00:00Z",
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "CF1",
                    cf2: "CF2",
                },
            ],
            lastImportExportDate: 1677590000000,
        };
        const importData = createImport(
            [
                {
                    uid: 1672531200000,
                    sc: 4,
                    sd: 1677620000000,
                    cf1: "CF1-updated",
                    cf2: "CF2-updated",
                },
            ],
            [
                {
                    uid: 1672531200001,
                    sc: 5,
                    sd: 1677602000000,
                    dd: 1677610000000,
                    cf1: "CF1-new",
                    cf2: "CF2-new",
                },
            ],
            1677600000000
        );
        const [result, stats] = mergeImportedContacts(initialState, importData);
        expectContactMatch(result.active[0], {
            uid: 1672531200000,
            sc: 4,
            sd: 1677620000000,
            cf1: "CF1-updated",
            cf2: "CF2-updated",
            dd: 0,
        });
        expectContactMatch(result.deleted[0], {
            uid: 1672531200001,
            sc: 5,
            sd: 1677602000000,
            cf1: "CF1-new",
            cf2: "CF2-new",
            dd: 1677610000000,
        });
        expect(result.lastImportExportDate).toBe(1677600000000);
        expect(stats).toEqual({ contactsDeleted: 0, contactsProcessed: 2 });
    });

    it("handles import with zero sentCount", () => {
        const initialState: ContactState = {
            active: [
                {
                    uid: 1672531200000,
                    na: "US",
                    i: "TestInst",
                    s: "TestGroup",
                    n: "Test",
                    e: "test@example.com",
                    sc: 3,
                    sd: 1677600000000,
                    ud: "2023-01-01T00:00:00Z",
                    dd: 0,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "CF1",
                    cf2: "CF2",
                },
            ],
            deleted: [],
            lastImportExportDate: 1677590000000,
        };
        const importData = createImport(
            [
                {
                    uid: 1672531200000,
                    sc: undefined,
                    sd: undefined,
                    cf1: "CF1-updated",
                    cf2: "CF2-updated",
                },
            ],
            [],
            1677600000000
        );
        const [result, stats] = mergeImportedContacts(initialState, importData);
        expectContactMatch(result.active[0], {
            sc: 3,
            sd: 1677600000000,
            cf1: "CF1",
            cf2: "CF2",
            dd: 0,
        });
        expect(result.lastImportExportDate).toBe(1677600000000);
        expect(stats).toEqual({ contactsDeleted: 0, contactsProcessed: 1 });
    });

    it("handles import with same sentDate but different sentCount", () => {
        const initialState: ContactState = {
            active: [
                {
                    uid: 1672531200000,
                    na: "US",
                    i: "TestInst",
                    s: "TestGroup",
                    n: "Test",
                    e: "test@example.com",
                    sc: 3,
                    sd: 1677600000000,
                    ud: "2023-01-01T00:00:00Z",
                    dd: 0,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "CF1",
                    cf2: "CF2",
                },
            ],
            deleted: [],
            lastImportExportDate: 1677590000000,
        };
        const importData = createImport(
            [
                {
                    uid: 1672531200000,
                    sc: 2,
                    sd: 1677600000000,
                    cf1: "CF1-updated",
                    cf2: "CF2-updated",
                },
            ],
            [],
            1677590000000
        );
        const [result, stats] = mergeImportedContacts(initialState, importData);
        expectContactMatch(result.active[0], {
            sc: 3,
            sd: 1677600000000,
            cf1: "CF1",
            cf2: "CF2",
            dd: 0,
        });
        expect(result.lastImportExportDate).toBe(1677590000000);
        expect(stats).toEqual({ contactsDeleted: 0, contactsProcessed: 1 });
    });

    it("handles import with deleted contact with lower sc than local deleted", () => {
        const initialState: ContactState = {
            active: [],
            deleted: [
                {
                    uid: 1672531200000,
                    na: "US",
                    i: "TestInst",
                    s: "TestGroup",
                    n: "Test",
                    e: "test@example.com",
                    sc: 3,
                    sd: 1677600000000,
                    ud: "2023-01-01T00:00:00Z",
                    dd: 1677605000000,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "CF1",
                    cf2: "CF2",
                },
            ],
            lastImportExportDate: 1677590000000,
        };
        const importData = createImport(
            [],
            [
                {
                    uid: 1672531200000,
                    sc: 2,
                    sd: 1677620000000,
                    dd: 1677630000000,
                    cf1: "CF1-updated",
                    cf2: "CF2-updated",
                },
            ],
            1677600000000
        );
        const [result, stats] = mergeImportedContacts(initialState, importData);
        expect(result.active).toEqual([]);
        expectContactMatch(result.deleted[0], {
            sc: 3,
            sd: 1677600000000,
            dd: 1677605000000,
            cf1: "CF1",
            cf2: "CF2",
        });
        expect(result.lastImportExportDate).toBe(1677600000000);
        expect(stats).toEqual({ contactsDeleted: 0, contactsProcessed: 1 });
    });

    it("handles import with future exportDate but old sentDate", () => {
        const initialState: ContactState = {
            active: [
                {
                    uid: 1672531200000,
                    na: "US",
                    i: "TestInst",
                    s: "TestGroup",
                    n: "Test",
                    e: "test@example.com",
                    sc: 4,
                    sd: 1677686400000,
                    ud: "2023-01-01T00:00:00Z",
                    dd: 0,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "CF1",
                    cf2: "CF2",
                },
            ],
            deleted: [],
            lastImportExportDate: 1677590000000,
        };
        const importData = createImport(
            [
                {
                    uid: 1672531200000,
                    sc: 3,
                    sd: 1677600000000,
                    cf1: "CF1-updated",
                    cf2: "CF2-updated",
                },
            ],
            [],
            1677700000000
        );
        const [result, stats] = mergeImportedContacts(initialState, importData);
        expectContactMatch(result.active[0], {
            sc: 7,
            sd: 1677686400000,
            cf1: "CF1-updated",
            cf2: "CF2-updated",
        });
        expect(result.lastImportExportDate).toBe(1677700000000);
        expect(stats).toEqual({ contactsDeleted: 0, contactsProcessed: 1 });
    });

    // Can only happen if the export is from a different device
    // Multi device is generally not supported, but this logic should not affect intended use.
    it("handles import with deleted contact with higher sc than local deleted", () => {
        const initialState: ContactState = {
            active: [],
            deleted: [
                {
                    uid: 1672531200000,
                    na: "US",
                    i: "TestInst",
                    s: "TestGroup",
                    n: "Test",
                    e: "test@example.com",
                    sc: 3,
                    sd: 1677600000000,
                    ud: "2023-01-01T00:00:00Z",
                    dd: 1677605000000,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "CF1",
                    cf2: "CF2",
                },
            ],
            lastImportExportDate: 1677590000000,
        };
        const importData = createImport(
            [],
            [
                {
                    uid: 1672531200000,
                    sc: 4,
                    sd: 1677620000000,
                    dd: 1677630000000,
                    cf1: "CF1-updated",
                    cf2: "CF2-updated",
                },
            ],
            1677600000000
        );
        const [result, stats] = mergeImportedContacts(initialState, importData);
        expect(result.active).toEqual([]);
        expectContactMatch(result.deleted[0], {
            sc: 4,
            sd: 1677620000000,
            dd: 1677630000000,
            cf1: "CF1-updated",
            cf2: "CF2-updated",
        });
        expect(result.lastImportExportDate).toBe(1677600000000);
        expect(stats).toEqual({ contactsDeleted: 0, contactsProcessed: 1 });
    });

    // Can only happen if the export is from a different device
    // Multi device is generally not supported, but this logic should not affect intended use.
    it("handles new sends for deleted contact", () => {
        const initialState = deleteContact(
            {
                active: [],
                deleted: [
                    {
                        uid: 1672531200000,
                        na: "US",
                        i: "TestInst",
                        s: "TestGroup",
                        n: "Test",
                        e: "test@example.com",
                        sc: 3,
                        sd: 1677600000000,
                        ud: "2023-01-01T00:00:00Z",
                        dd: 1677610000000,
                        cb1: "CB1",
                        cb2: "CB2",
                        cf1: "CF1",
                        cf2: "CF2",
                    },
                ],
                lastImportExportDate: 1677590000000,
            },
            1672531200000,
            1677610000000
        );
        const importData = createImport(
            [],
            [
                {
                    uid: 1672531200000,
                    sc: 5,
                    sd: 1677686400000,
                    dd: 1677610000000,
                    cf1: "CF1-updated",
                    cf2: "CF2-updated",
                },
            ],
            1677670000000
        );
        const [result, stats] = mergeImportedContacts(initialState, importData);
        expect(result.active).toEqual([]);
        expectContactMatch(result.deleted[0], {
            sc: 5,
            sd: 1677686400000,
            dd: 1677610000000,
            cf1: "CF1-updated",
            cf2: "CF2-updated",
        });
        expect(result.lastImportExportDate).toBe(1677670000000);
        expect(stats).toEqual({ contactsDeleted: 0, contactsProcessed: 1 });
    });
});
