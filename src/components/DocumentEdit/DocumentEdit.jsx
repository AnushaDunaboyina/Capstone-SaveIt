import React, { useState, useEffect } from 'react';
import axios from "axios";
import { API_URL } from "../../config";

export default function DocumentEdit () {
  const [filename, setFilename] = useState(document?.filename || "");
}