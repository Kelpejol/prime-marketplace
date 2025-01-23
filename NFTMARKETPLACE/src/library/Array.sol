// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;


  // get the array -> [1,2,3,4,5,6]. if the value is greater than the number at the array index. my new array would start from the next number to the end
// of the initial array last index -> [5,6] 
 library Array {
    function BinarySearch(uint256[] calldata sortedArray, uint256 _id) external pure returns (int256) {
        if (sortedArray.length == 0 || _id < sortedArray[0] || _id > sortedArray[sortedArray.length - 1]) {
            return -1;
        }

        uint256 low = 0;
        uint256 high = sortedArray.length - 1;

        while (low <= high) {
            uint256 mid = low + (high - low) / 2;

            if (sortedArray[mid] == _id || sortedArray[low] == _id || sortedArray[high] == _id) {
                return int256(mid);
            } else if (sortedArray[mid] < _id) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        return -1;
    }
}
 

