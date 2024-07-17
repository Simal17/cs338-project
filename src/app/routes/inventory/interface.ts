export interface ProductDetail {
  attr: string;
  label: string;
  required: boolean;
}

export interface ProductInfo {
  model_no?: number;
  name?: string;
  manufacture?: string;
  retail_price?: number;
  stock_qtty?: number;
  tdp?: number;
  color?: string;
}

export const listOfPType = [
  { value: "1", label: "Case" },
  { value: "2", label: "CPU Cooler" },
  { value: "3", label: "CPU" },
  { value: "4", label: "GPU" },
  { value: "5", label: "Memory" },
  { value: "7", label: "Motherboard" },
  { value: "8", label: "PSU" },
  { value: "9", label: "Storage" },
];

export const FORMITEMS = {
  FILTERINFO: ["ptype", "manufacture", "prange"],
  PRODUCTINFO: [
    "pname",
    "manufacture",
    "retail_price",
    "stock_qtty",
    "tdp",
    "ptype",
  ],
  CPUDETAIL: [
    { attr: "core_count", label: "Core Count", required: true },
    { attr: "core_clock", label: "Core Clock", required: true },
    { attr: "boost_clock", label: "Boost Clock", required: true },
    { attr: "graphics", label: "Graphics", required: false },
    { attr: "socket", label: "Socket", required: false },
  ],
  CASEDETAIL: [
    { attr: "type", label: "Type", required: true },
    { attr: "psu", label: "PSU", required: true },
    { attr: "side_panel", label: "Side Panel", required: true },
    { attr: "external_volume", label: "External Volume", required: true },
    { attr: "internal_35_bays", label: "Internal 3.5 Bays", required: true },
  ],
  CPUCOOLERDETAIL: [
    { attr: "RPM_low", label: "RPM Low", required: true },
    { attr: "RPM_high", label: "RPM High", required: true },
    { attr: "noise_level", label: "Noise Level", required: true },
    { attr: "water_cooled", label: "Water Cooled", required: false },
  ],
  GPUDETAIL: [
    { attr: "chipset", label: "Chipset", required: true },
    { attr: "memory", label: "Memory", required: true },
    { attr: "memory_type", label: "Memory Type", required: false },
    { attr: "core_clock", label: "Core Clock", required: true },
    { attr: "boost_clock", label: "Boost Clock", required: true },
  ],
  MEMORYDETAIL: [
    { attr: "type", label: "Type", required: true },
    { attr: "speed", label: "Speed", required: true },
    { attr: "kit_size", label: "Kit Size", required: true },
    { attr: "size_per_stick", label: "Size Per Stick", required: true },
    { attr: "first_word_latency", label: "First Word Latency", required: true },
    { attr: "cas_latency", label: "CAS Latency", required: true },
  ],
  MOBODETAIL: [
    { attr: "socket", label: "Socket", required: false },
    { attr: "RAM_slots", label: "RAM Slots", required: true },
    { attr: "storage_slots", label: "Storage Slots", required: false },
    { attr: "has_wifi", label: "Has WiFi", required: false },
  ],
  PSUDETAIL: [
    { attr: "type", label: "Type", required: true },
    { attr: "efficiency", label: "Efficiency", required: true },
    { attr: "wattage", label: "Wattage", required: true },
    { attr: "modular", label: "Modular", required: false },
  ],
  STORAGEDETAIL: [
    { attr: "capacity", label: "Capacity", required: true },
    { attr: "price_per_gb", label: "Price per GB", required: true },
    { attr: "type", label: "Type", required: true },
    { attr: "cache", label: "Cache", required: true },
    { attr: "form_factor", label: "Form Factor", required: true },
    { attr: "interface", label: "Interface", required: true },
  ],
};
