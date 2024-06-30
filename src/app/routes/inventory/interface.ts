export interface ProductDetail {
  attr: string;
  label: string;
}

export const FORMITEMS = {
  PRODUCTINFO: [
    "pname",
    "manufacture",
    "retail_price",
    "stock_qtty",
    "tdp",
    "ptype",
  ],
  CPUDETAIL: [
    {attr: 'core_count', label: 'Core Count'},
    {attr: 'core_clock', label: 'Core Clock'},
    {attr: 'boost_clock', label: 'Boost Clock'},
    {attr: 'graphics', label: 'Graphics'},
    {attr: 'socket', label: 'Socket'}
  ],

};
