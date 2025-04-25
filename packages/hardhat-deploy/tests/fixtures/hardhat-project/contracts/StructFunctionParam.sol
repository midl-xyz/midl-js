// SPDX-License-Identifier: UNLICENSED

contract StructFunctionParam {
    struct Foo {
        string first;
        uint256 second;
        address third;
    }
    function foo(Foo[] calldata _params) public returns (uint256) {
        return 1;
    }
}
