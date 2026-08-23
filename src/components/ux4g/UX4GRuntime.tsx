"use client";

import { useEffect } from "react";

export default function UX4GRuntime() {
  useEffect(() => {
    void import("ux4g-web-components/design-system");
  }, []);

  return null;
}