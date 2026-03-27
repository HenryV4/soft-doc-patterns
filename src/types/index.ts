export interface TransactionRecord {
    RUNDATE: string;
    FY: string;
    FM: string;
    DOCID: string;
    CHKSUBTOT: string;
    VCODE: string;
    VENDOR: string;
    ZIP5?: string;
    FTYP: string;
    FUNDTYPE: string;
    DPT: string;
    DEPARTMENT: string;
    ACTV: string;
    ACTIVITY: string;
    OGRP: string;
    OBJECTGROUP: string;
    OBJ: string;
    OBJECT: string;
    COMM?: string;
    COMMODITYDSCR?: string;
    INVOICEDATE?: string;
    INVOICENUMBER?: string;
}