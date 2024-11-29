// rendered in TermOfUse

// components - header
import TextPolicy from "../header/TextPolicy";
import DescPolicy from "../header/DescPolicy";

import { TOS } from "../../constants/details/PolicyData";
import React from "react";

export default function ListTermOfUse() {
  return (
    <>
      {TOS.map((term, key) => (
        <React.Fragment key={key}>
          <TextPolicy>{term.title}</TextPolicy>
          <DescPolicy>{term.description}</DescPolicy>
        </React.Fragment>
      ))}
    </>
  );
}
