// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {AggregatorV3Interface} from "chainlink-contract/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {ApprovedCurrencyLibStorage} from "./ApprovedCurrencyLibStorage.sol";

library ApprovedCurrencyLib {
    event CurrencyRemoved(address indexed _currency);
    event CurrencySet(address indexed _currency, address indexed _priceFeed);
    error __ApprovedCurrency_CurrencyNotApproved(address _currency);

    function _setApprovedCurrency(
        address _currency,
        address _priceFeed
    ) internal {
        bool isInserted = ApprovedCurrencyLibStorage
            .data()
            .currencyToIsInserted[_currency];
        if (!isInserted) {
            uint8 currencyIndex = getInvalidCurrencyIndex();
            ApprovedCurrencyLibStorage.data().currency[
                currencyIndex
            ] = _currency;
            ApprovedCurrencyLibStorage.data().currencyToPriceFeed[
                _currency
            ] = _priceFeed;
            ApprovedCurrencyLibStorage.data().currencyToIsInserted[
                _currency
            ] = true;
        } else {
            uint8 currencyIndex = getValidCurrencyIndex(_currency);
            ApprovedCurrencyLibStorage.data().currency[
                currencyIndex
            ] = _currency;
            ApprovedCurrencyLibStorage.data().currencyToPriceFeed[
                _currency
            ] = _priceFeed;
        }

        emit CurrencySet(_currency, _priceFeed);
    }

    function _removeApprovedCurrency(address _currency) internal {
        bool isInserted = ApprovedCurrencyLibStorage
            .data()
            .currencyToIsInserted[_currency];
        if (isInserted) {
            uint8 currencyIndex = getValidCurrencyIndex(_currency);
            ApprovedCurrencyLibStorage.data().currency[currencyIndex] = address(
                0
            );
            ApprovedCurrencyLibStorage.data().currencyToPriceFeed[
                _currency
            ] = address(0);
            ApprovedCurrencyLibStorage.data().currencyToIsInserted[
                _currency
            ] = false;
        } else {
            revert __ApprovedCurrency_CurrencyNotApproved(_currency);
        }
        emit CurrencyRemoved(_currency);
    }

    function getCurrencyPriceInfo(
        address _currency
    )
        internal
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        address priceFeedAddress = ApprovedCurrencyLibStorage
            .data()
            .currencyToPriceFeed[_currency];
        (
            roundId,
            answer,
            startedAt,
            updatedAt,
            answeredInRound
        ) = AggregatorV3Interface(priceFeedAddress).latestRoundData();
    }

    function getCurrencyDecimals(
        address _currency
    ) internal view returns (uint8) {
        address priceFeedAddress = ApprovedCurrencyLibStorage
            .data()
            .currencyToPriceFeed[_currency];
        uint8 decimal = AggregatorV3Interface(priceFeedAddress).decimals();
        return decimal;
    }

    function getApprovedCurrencySize() internal view returns (uint256) {
        return ApprovedCurrencyLibStorage.data().currency.length;
    }

    function getAllCurrency() internal view returns (address[10] memory) {
        address[10] memory currency;
        uint256 length = getApprovedCurrencySize();

        for (uint256 i = 0; i < length; ++i) {
            currency[i] = ApprovedCurrencyLibStorage.data().currency[i];
        }

        return currency;
    }

    function getValidCurrencyIndex(
        address _currency
    ) internal view returns (uint8 index) {
        uint256 length = getApprovedCurrencySize();
        for (uint8 i = 0; i < length; ++i) {
            address currency = ApprovedCurrencyLibStorage.data().currency[i];
            if (_currency == currency) {
                return index = i;
            }
        }
    }

    function getInvalidCurrencyIndex() internal view returns (uint8 index) {
        uint256 length = getApprovedCurrencySize();

        for (uint8 i = 0; i < length; ++i) {
            address currency = ApprovedCurrencyLibStorage.data().currency[i];
            if (currency == address(0)) {
                return index = i;
            }
        }
    }
}
