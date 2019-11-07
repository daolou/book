/*
 *
 * [1] 两数之和
 *
 * 给定一个整数数组 nums和一个目标值 target，请你在该数组中找出和为目标值的那两个整数，并返回他们的数组下标。
 *
 * 你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。
 *
 * 示例:
 *
 * 给定 nums = [2, 7, 11, 15], target = 9
 *
 * 因为 nums[0] + nums[1] = 2 + 7 = 9
 * 所以返回 [0, 1]
 *
 *
 */
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  // for (let i = 0,len = nums.length; i < len; i++) {
  //     const nums0 = nums[i];
  //     const nums1 = target - nums0;
  //     const findidx = nums.findIndex(val => val === nums1);

  //     if(findidx > -1 && findidx !== i){
  //         return [i,findidx]
  //     }
  // }
  const m = new Map();
  nums.forEach((value, key) => {
    m.set(value, key);
  });
  for (let i = 0, len = nums.length; i < len; i++) {
    const nums0 = nums[i];
    const nums1 = target - nums0;
    const findidx = m.get(nums1);

    if (findidx && findidx !== i) {
      return [i, findidx];
    }
  }
};

// test

let nums = [2, 7, 11, 15],
  target = 9;

let res = twoSum(nums, target);
console.log(res);
