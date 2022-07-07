import ethers from "ethers";

const bigIntToNum = (number) => {
    const toUnit = ethers.utils.formatEther(number).toString();
    const roundedCount = Math.round(parseFloat(toUnit) * 10 ** 18);
    return roundedCount;
};

export default bigIntToNum;
