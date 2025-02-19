"use client";
import moment from "moment-jalaali";

export default function ConvertDate({ date }) {
    moment.loadPersian({ dialect: "persian-modern" });

    const jalaliDate = moment(date, "YYYY-MM-DD HH:mm:ss").format("jYYYY/jMM/jDD HH:mm");

    return <>{jalaliDate }</>;
}