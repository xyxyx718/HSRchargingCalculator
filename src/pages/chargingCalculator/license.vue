<template>
	<view>
		<view class="licence" hover-class="licence-hover" @click="copyToClipboard">
			<view>开源地址：</view>
			<view class="url"><text selectable user-select>https://github.com/xyxyx718/HSRchargingCalculator</text>
			</view>
			<view>本项目遵循MIT License</view>
		</view>
		<view class="licence">
			<text>{{licence}}</text>
		</view>
	</view>


</template>

<script>
	export default {
		data() {
			return {
				licence: `MIT License

Copyright (c) 2023 xyxyx718

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`

			}
		},
		methods: {
			copyToClipboard() {
				uni.setClipboardData({
					data: 'https://github.com/xyxyx718/HSRchargingCalculator',
					success: function() {
						uni.showToast({
							title: '链接地址已复制',
							icon: 'success'
						});
					}
				});
			},
		}
	}
</script>

<style>
	.licence {
		margin: 20rpx;
		padding: 20rpx;
		border: 1rpx solid black;
		border-radius: 20rpx;
	}

	.licence-hover {
		background-color: #f0f0f0;
	}

	.url {
		word-break: break-all;
		text-decoration: underline;
	}
</style>