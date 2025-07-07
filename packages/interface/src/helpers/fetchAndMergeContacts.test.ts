import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContactI3C } from "../types/typesI3C";
import { ERROR_EMPTY_CONTACTS_ARRAY } from "../constants/constants";
import { setDevMode } from "./getSetDevMode";
import { emulateConsoleTable } from "./testHelpers/emulateConsoleTable";
import { emulateLocalStorage } from "./testHelpers/emulateLocalStorage";

emulateLocalStorage();
console.table = emulateConsoleTable;

const mockCsvParse = vi.fn();
const mockFetch = vi.fn();
const mockInitializeStorage = vi.fn();
const mockGetActiveContacts = vi.fn();
const mockStoreActiveContacts = vi.fn();
const mockStoreDeletedContacts = vi.fn();
const mockRemoveActiveContactByUid = vi.fn();
const mockGetDeletedContacts = vi.fn();

// Mock toast
vi.mock("react-toastify", () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
        info: vi.fn(),
    },
}));

vi.mock("./csvParse", () => ({
    csvParse: mockCsvParse,
}));

vi.mock("./indexedDB", () => ({
    initializeStorage: mockInitializeStorage,
    getActiveContacts: mockGetActiveContacts,
    getDeletedContacts: mockGetDeletedContacts,
    storeActiveContacts: mockStoreActiveContacts,
    storeDeletedContacts: mockStoreDeletedContacts,
    removeActiveContactByUid: mockRemoveActiveContactByUid,
}));

describe("fetchAndMergeContacts", () => {
    const mockDateNow = 1677600000000; // Feb 28, 2023, 08:40:00 UTC
    let fetchAndMergeContacts: typeof import("./fetchAndMergeContacts").fetchAndMergeContacts;
    let checkOverlapIndexedDBActiveAndDeletedContacts: typeof import("./checkOverlapInData").checkOverlapIndexedDBActiveAndDeletedContacts;

    const mockFetchFn = vi.fn(async (): Promise<ContactI3C[]> => {
        const response = await mockFetch("some-url");
        const csvText = await response.text();
        return mockCsvParse(csvText).data;
    });

    beforeEach(async () => {
        // Dynamically import the modules after mocks are set up
        ({ fetchAndMergeContacts } = await import("./fetchAndMergeContacts"));
        ({ checkOverlapIndexedDBActiveAndDeletedContacts } = await import("./checkOverlapInData"));

        vi.useFakeTimers();
        vi.setSystemTime(mockDateNow);
        vi.clearAllMocks();
        console.error = vi.fn();
        console.warn = vi.fn();
        setDevMode("enabled");

        mockFetch.mockReset();
        mockCsvParse.mockReset();
        mockInitializeStorage.mockReset();
        mockGetActiveContacts.mockReset();
        mockGetDeletedContacts.mockReset();
        mockStoreActiveContacts.mockReset();
        mockStoreDeletedContacts.mockReset();
        mockRemoveActiveContactByUid.mockReset();

        mockGetDeletedContacts.mockResolvedValue([]); // Default setup to avoid overlap
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("handles empty online", async () => {
        mockFetch.mockResolvedValue({ text: async () => "" });
        mockCsvParse.mockReturnValue({ data: [] });
        mockGetActiveContacts.mockResolvedValue([]);

        await expect(fetchAndMergeContacts(mockFetchFn)).rejects.toThrow(ERROR_EMPTY_CONTACTS_ARRAY);
    });

    it("handles online contacts with empty local contacts", async () => {
        const onlineContact: ContactI3C = {
            uid: 1,
            na: "US",
            i: "Inst",
            s: "Group",
            n: "Test",
            e: "test@example.com",
            sd: 0,
            sc: 0,
            ud: "2023-01-01",
            dd: 0,
            cb1: "CB1",
            cb2: "CB2",
            cf1: "",
            cf2: "",
        };

        mockFetch.mockResolvedValue({ text: async () => "" });
        mockCsvParse.mockReturnValue({ data: [onlineContact] });
        mockGetActiveContacts.mockResolvedValue([]);

        const result = await fetchAndMergeContacts(mockFetchFn);

        expect(result).toEqual([onlineContact]);
        expect(mockStoreActiveContacts).toHaveBeenCalledWith([onlineContact]);
    });

    it("merges overlapping contacts with local data preserved", async () => {
        mockFetch.mockResolvedValue({ text: async () => "" });
        mockCsvParse.mockReturnValue({
            data: [
                {
                    uid: 1,
                    na: "US",
                    i: "Inst",
                    s: "Group",
                    n: "Test",
                    e: "test@example.com",
                    sd: 0,
                    sc: 0,
                    ud: "2023-01-01",
                    dd: 0,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "",
                    cf2: "",
                },
            ],
        });
        mockGetActiveContacts.mockResolvedValue([
            {
                uid: 1,
                na: "US-old",
                i: "Inst-old",
                s: "Group-old",
                n: "Test-old",
                e: "test@example.old",
                sd: 1677580000000,
                sc: 2,
                ud: "2022-03-11",
                dd: 0,
                cb1: "CB1-old",
                cb2: "CB2-old",
                cf1: "CF1",
                cf2: "CF2",
            },
        ]);

        const result = await fetchAndMergeContacts(mockFetchFn);

        const resultContact: ContactI3C = {
            uid: 1,
            na: "US",
            i: "Inst",
            s: "Group",
            n: "Test",
            e: "test@example.com",
            sd: 1677580000000,
            sc: 2,
            ud: "2023-01-01",
            dd: 0,
            cb1: "CB1",
            cb2: "CB2",
            cf1: "CF1",
            cf2: "CF2",
        };

        expect(result).toEqual([resultContact]);
        expect(mockStoreActiveContacts).toHaveBeenCalledWith([resultContact]);
    });

    it("handles local contact not in online (deleted)", async () => {
        const onlineContact: ContactI3C = {
            uid: 1,
            na: "US",
            i: "Inst",
            s: "Group",
            n: "Test1",
            e: "test1@example.com",
            sd: 0,
            sc: 0,
            ud: "2023-01-01",
            dd: 0,
            cb1: "CB1",
            cb2: "CB2",
            cf1: "",
            cf2: "",
        };
        const activeContact: ContactI3C = {
            uid: 2,
            na: "US",
            i: "Inst",
            s: "Group",
            n: "Test2",
            e: "test2@example.com",
            sd: 1677580000000,
            sc: 2,
            ud: "2023-01-01",
            dd: 0,
            cb1: "CB1",
            cb2: "CB2",
            cf1: "CF1",
            cf2: "CF2",
        };

        mockFetch.mockResolvedValue({ text: async () => "" });
        mockCsvParse.mockReturnValue({ data: [onlineContact] });
        mockGetActiveContacts.mockResolvedValue([activeContact]);

        const result = await fetchAndMergeContacts(mockFetchFn);

        expect(result).toEqual([onlineContact]);
        expect(mockStoreDeletedContacts).toHaveBeenCalledWith(activeContact);
        expect(mockRemoveActiveContactByUid).toHaveBeenCalledWith(2);
    });

    it("handles abort signal", async () => {
        mockFetch.mockRejectedValue(new DOMException("Aborted", "AbortError"));
        mockGetActiveContacts.mockResolvedValue([]);

        const abortingController = new AbortController();
        abortingController.abort();

        await expect(fetchAndMergeContacts(mockFetchFn)).rejects.toThrow("Aborted");
        expect(mockInitializeStorage).not.toHaveBeenCalled();
    });

    it("detects overlap between active and deleted contacts", async () => {
        mockFetch.mockResolvedValue({ text: async () => "" });
        mockCsvParse.mockReturnValue({
            data: [
                {
                    uid: 3, // Different UID to not interfere with the overlap test
                    na: "CA",
                    i: "Inst",
                    s: "Group",
                    n: "Test3",
                    e: "test3@example.com",
                    sd: 0,
                    sc: 0,
                    ud: "2023-01-01",
                    dd: 0,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "",
                    cf2: "",
                },
            ],
        });

        // Setup overlap between active and deleted contacts
        const activeContacts = [
            {
                uid: 1,
                na: "US",
                i: "Inst",
                s: "Group",
                n: "Test",
                e: "test@example.com",
                sd: 1677580000000,
                sc: 2,
                ud: "2023-01-01",
                dd: 0,
                cb1: "CB1",
                cb2: "CB2",
                cf1: "CF1",
                cf2: "CF2",
            },
        ];

        const deletedContacts = [
            {
                uid: 1, // Same UID as in active contacts
                na: "US",
                i: "Inst",
                s: "Group",
                n: "Test",
                e: "test@example.com",
                sd: 1677580000000,
                sc: 2,
                ud: "2023-01-01",
                dd: mockDateNow,
                cb1: "CB1",
                cb2: "CB2",
                cf1: "CF1",
                cf2: "CF2",
            },
        ];

        mockGetActiveContacts.mockResolvedValue(activeContacts);
        mockGetDeletedContacts.mockResolvedValue(deletedContacts);

        await fetchAndMergeContacts(mockFetchFn);
        const overlapResult = await checkOverlapIndexedDBActiveAndDeletedContacts();

        expect(overlapResult).toBe(true);
    });

    it("handles local contact with missing fields", async () => {
        mockFetch.mockResolvedValue({ text: async () => "" });
        mockCsvParse.mockReturnValue({
            data: [
                {
                    uid: 1,
                    na: "US",
                    i: "Inst",
                    s: "Group",
                    n: "Test",
                    e: "test@example.com",
                    sd: 0,
                    sc: 0,
                    ud: "2023-01-01",
                    dd: 0,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "",
                    cf2: "",
                },
            ],
        });
        mockGetActiveContacts.mockResolvedValue([
            {
                uid: 1,
                // na: "US",
                // i: "Inst",
                // s: "Group",
                // n: "Test",
                // e: "test@example.com",
                sd: 1677570000000,
                sc: 1,
                // ud: "2023-01-01",
                dd: 0,
                // cb1: "CB1-old",
                // cb2: "CB2-old",
                cf1: "CF1",
                cf2: "CF2",
            },
        ]);

        const result = await fetchAndMergeContacts(mockFetchFn);

        expect(result).toEqual([
            {
                uid: 1,
                na: "US",
                i: "Inst",
                s: "Group",
                n: "Test",
                e: "test@example.com",
                sd: 1677570000000,
                sc: 1,
                ud: "2023-01-01",
                dd: 0,
                cb1: "CB1",
                cb2: "CB2",
                cf1: "CF1",
                cf2: "CF2",
            },
        ]);
    });

    it("checkNoOverlapActiveDeletedContacts detects overlap correctly", async () => {
        const activeContacts = [
            { uid: 1, na: "US", e: "test1@example.com" },
            { uid: 2, na: "UK", e: "test2@example.com" },
        ] as ContactI3C[];

        const deletedContacts = [
            { uid: 1, na: "US", e: "test1@example.com" }, // Overlapping UID
            { uid: 3, na: "CA", e: "test3@example.com" },
        ] as ContactI3C[];

        mockGetActiveContacts.mockResolvedValue(activeContacts);
        mockGetDeletedContacts.mockResolvedValue(deletedContacts);

        const result = await checkOverlapIndexedDBActiveAndDeletedContacts();

        expect(result).toBe(true);
    });

    it("checkNoOverlapActiveDeletedContacts reports no overlap when none exists", async () => {
        const activeContacts = [
            { uid: 1, na: "US", e: "test1@example.com" },
            { uid: 2, na: "UK", e: "test2@example.com" },
        ] as ContactI3C[];

        const deletedContacts = [
            { uid: 3, na: "CA", e: "test3@example.com" },
            { uid: 4, na: "DE", e: "test4@example.com" },
        ] as ContactI3C[];

        mockGetActiveContacts.mockResolvedValue(activeContacts);
        mockGetDeletedContacts.mockResolvedValue(deletedContacts);

        const result = await checkOverlapIndexedDBActiveAndDeletedContacts();

        expect(result).toBe(false);
    });
});

describe("checkIfActiveAndOnlineContactsSynced", () => {
    let checkIfActiveAndOnlineContactsSynced: typeof import("./checkOverlapInData").checkIfActiveAndOnlineContactsSynced;

    beforeEach(async () => {
        ({ checkIfActiveAndOnlineContactsSynced } = await import("./checkOverlapInData"));
        console.warn = vi.fn();
        console.table = vi.fn();
    });

    it("returns 0 and does not warn when all local contacts are present online", async () => {
        const activeContacts = [
            { uid: 1, na: "US", e: "test1@example.com" },
            { uid: 2, na: "UK", e: "test2@example.com" },
        ] as ContactI3C[];
        mockGetActiveContacts.mockResolvedValue(activeContacts);

        const onlineContactUids = new Set([1, 2]);
        const result = await checkIfActiveAndOnlineContactsSynced(onlineContactUids);

        expect(result).toBe(0);
        expect(console.warn).not.toHaveBeenCalled();
        expect(console.table).not.toHaveBeenCalled();
    });

    it("returns correct count and warns when some local contacts are missing online", async () => {
        const activeContacts = [
            { uid: 1, na: "US", e: "test1@example.com" },
            { uid: 2, na: "UK", e: "test2@example.com" },
            { uid: 3, na: "CA", e: "test3@example.com" },
        ] as ContactI3C[];
        mockGetActiveContacts.mockResolvedValue(activeContacts);

        const onlineContactUids = new Set([1, 2]);
        const result = await checkIfActiveAndOnlineContactsSynced(onlineContactUids);

        expect(result).toBe(1);
        expect(console.table).toHaveBeenCalledWith([{ uid: 3, na: "CA", e: "test3@example.com" }]);
    });

    it("returns correct count and warns when all local contacts are missing online", async () => {
        const activeContacts = [
            { uid: 10, na: "FR", e: "test10@example.com" },
            { uid: 20, na: "DE", e: "test20@example.com" },
        ] as ContactI3C[];
        mockGetActiveContacts.mockResolvedValue(activeContacts);

        const onlineContactUids = new Set<number>();
        const result = await checkIfActiveAndOnlineContactsSynced(onlineContactUids);

        expect(result).toBe(2);
        expect(console.table).toHaveBeenCalledWith(activeContacts);
    });

    it("returns 0 and does not warn when there are no local contacts", async () => {
        mockGetActiveContacts.mockResolvedValue([]);

        const onlineContactUids = new Set([1, 2, 3]);
        const result = await checkIfActiveAndOnlineContactsSynced(onlineContactUids);

        expect(result).toBe(0);
        expect(console.warn).not.toHaveBeenCalled();
        expect(console.table).not.toHaveBeenCalled();
    });
});
