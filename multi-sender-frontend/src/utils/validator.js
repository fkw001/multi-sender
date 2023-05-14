export const validateInputAddresses = (address) => {
  return /^(0x){1}[0-9a-fA-F]{40}$/i.test(address);
};
const errLength = "Line only have 2 item is wallet and amount separated with comma";
const errAddress = "Invalid address";
const errAmount = "Invalid Amount";

export const isInValidWalletList = (arrWallet) => {
  const dataValidate = arrWallet.map((line, index) => {
    const arrItemLine = line.split(",");

    const isValidLength = arrItemLine.length !== 2;
    const isValidAddress = !validateInputAddresses(arrItemLine?.[0]?.trim());
    const isValidMount =
      typeof Number(arrItemLine?.[1]?.trim()) !== "number" ||
      Number(arrItemLine?.[1]?.trim()) <= 0;

    if (isValidLength) {
      return {
        data: line,
        line: index,
        message: errLength,
      };
    }

    if (isValidAddress) {
      return {
        data: line,
        line: index,
        message: errAddress,
      };
    }

    if (isValidMount) {
      return {
        data: line,
        line: index,
        message: errAmount,
      };
    }
    return undefined;
  });

  const filter = dataValidate.filter((line) => line !== undefined);
  return filter.length > 0 ? filter : false;
};
