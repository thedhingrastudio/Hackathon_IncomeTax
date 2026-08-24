"use client";
import { useState } from "react";
import { clearCase } from "../../lib/storage/case-storage";
export default function DemoReset(){const[done,setDone]=useState(false);return <section className="demo-reset"><h2>Prototype utility</h2><p>Clear the saved synthetic case to restart the assisted journey. Your AI Assistance preference is unchanged.</p><button className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md" type="button" onClick={()=>{clearCase();setDone(true)}}>Reset synthetic case</button>{done?<p role="status">Synthetic case cleared.</p>:null}</section>}
