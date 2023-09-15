import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif

const fs = uni.getFileSystemManager();
const PATH = `${wx.env.USER_DATA_PATH}` || `${qq.env.USER_DATA_PATH}` || '';
const dataPATH = `${PATH}/gachaData`;
try {
	fs.accessSync(dataPATH)
} catch (e) {
	fs.mkdirSync(dataPATH);
}

Vue.prototype.$writeJSONtoFile = writeJSONtoFile;
Vue.prototype.$readJSONfromFile = readJSONfromFile;
Vue.prototype.$deleteFile = deleteFile;

function writeJSONtoFile(filePath, jsonData) {
	const fs = uni.getFileSystemManager();

	// 将JSON对象转换为字符串
	let strData;
	if (typeof jsonData === 'object') {
		strData = JSON.stringify(jsonData);
	} else {
		strData = jsonData;
	}

	try {
		const res = fs.writeFileSync(
			dataPATH + filePath,
			strData,
			'utf8'
		)
		console.log(res)
	} catch (e) {
		console.log(e)
	}
}

function readJSONfromFile(filePath) {
	const fs = uni.getFileSystemManager();

	try {
			const strData = fs.readFileSync(dataPATH + filePath, 'utf8', 0)
			const jsonData = JSON.parse(strData);
			return jsonData;

	} catch (e) {
		console.log(e);
		return null;
	}

}

function deleteFile(filePath) {
	const fs = uni.getFileSystemManager();

	try {
		if (fs.accessSync(dataPATH + filePath)) {
			const res = fs.unlinkSync(dataPATH + filePath)
			console.log(res)
		}

	} catch (e) {
		console.error(e)
	}
}
