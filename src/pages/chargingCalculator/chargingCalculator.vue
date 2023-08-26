<template>
	<view class="container">
		<!-- 类型选择 -->
		<view class="type-selection">
			<view class="type" :class="[typeName===selectedType?'type-selected':'type']"
				v-for="(typeContent, typeName) in types" :key="typeName" @click="handleTypeSelection(typeName)">
				<text>{{ typeName }}</text>
			</view>
		</view>

		<!-- 角色选择 -->
		<view class="block">
			<picker class="picker-container" v-if="selectedType" :range="characterNames"
				@change="handleCharacterChange">
				<view class="picker" hover-class="picker-hover">
					<view class="picker-left"><text>角色</text></view>
					<view class="picker-right"><text>{{ selectedCharacter || '请选择角色' }}</text></view>
				</view>
			</picker>

			<!-- 显示角色基本信息 -->
			<view class="character-detail" v-if="currentCharacter">
				<view class="character-info">
					<view class="character-info-cell">
						<text>属性: {{ currentCharacter.attribute }}</text>
					</view>
					<view class="character-info-cell">
						<text>能量上限: {{ computedEnergyMax }}</text>
					</view>
				</view>

				<!-- 技能列表 -->
				<view class="character-skill" v-if="currentCharacter.skills && reset"
					v-for="(skill, skillName) in currentCharacter.skills" :key="skillName">
					<view class="skill-row">
						<view class="switch-container">
							<switch v-if="!skill.alwaysActive" @change="handleActivation(skill)" :checked="skill.active"
								color="#007ffc" />
						</view>
						<view class="skill-name"><text>{{ skillName }}</text></view>
						<!-- 选等级 -->
						<view class="level-cell"
							:class="{ 'level-cell-selected': (skill.selectedLevel||1) === index + 1 }"
							hover-class="level-cell-hover" v-if="skill.levels[0] > 1"
							v-for="(level,index) in skill.levels.slice(1)" :key="level.level"
							@click="selectLevel(skill, index)">
							<text>{{ level.level }}</text>
						</view>
					</view>
					<view class="skill-description">
						<text>{{ getSkillDescription(skill) }}</text>
					</view>
				</view>
			</view>

		</view>

		<!-- 光锥选择部分 -->
		<view class="block" v-if="currentCharacter">
			<picker class="picker-container lightCone-row" :range="lightConeNames" @change="handleLightConeChange">
				<view class="picker" hover-class="picker-hover">
					<view class="picker-left"><text>选择光锥：</text></view>
					<view class="picker-right"><text>{{ selectedLightCone || '请选择' }}</text></view>
				</view>
			</picker>

			<!-- 光锥效果展示 -->
			<view class="skill-row" v-if="selectedLightCone && selectedLightCone !== '无'">
				<view>
					<switch v-if="!currentLightCone.alwaysActive" @change="handleActivation(currentLightCone)"
						:checked="currentLightCone.active" color="#007ffc" />
				</view>
				<view class="level-cell"
					:class="{ 'level-cell-selected': (currentLightCone.selectedLevel||1) === index + 1 }"
					hover-class="level-cell-hover" v-if="currentLightCone.levels[0] > 1"
					v-for="(level,index) in currentLightCone.levels.slice(1)" :key="level.level"
					@click="selectLevel(currentLightCone, index)">
					<text>{{ level.level }}</text>

				</view>


			</view>
			<view class="skill-description" v-if="selectedLightCone && selectedLightCone !== '无'">
				<text>{{ getSkillDescription(currentLightCone) }}</text>
			</view>
		</view>

		<view class="hint">
			当基础模板无法满足需求时，请使用自定义充能
		</view>

		<!-- 额外效果选择 -->
		<view class="block" v-if="currentCharacter">
			<view class="picker extra" hover-class="picker-hover" @click="toggleExtraEffects">
				<view><text>{{ isExtraEffectsExpanded ? '收起额外效果' : '展开额外效果' }}</text></view>
			</view>
			<view v-if="isExtraEffectsExpanded">
				<!-- 初始能量 -->
				<view class="skill-row extra">
					<view class="initial-energy"><text>初始能量：{{ computedInitialEnergy }}</text></view>
					<view class="level-cell" :class="{ 'level-cell-selected': initialEnergy === 5 }"
						hover-class="level-cell-hover" @click="setInitialEnergy(5)">5</view>
					<view class="level-cell" :class="{ 'level-cell-selected': initialEnergy === 0.5 }"
						hover-class="level-cell-hover" @click="setInitialEnergy(0.5)">50%</view>
				</view>
				<!-- 自定义充能 -->
				<view class="skill-row extra">
					<view class="custom-energy">
						<view class="custom-energy-left"><text>自定义充能：</text></view>
						<input class="custom-energy-right" type="number" v-model="customEnergy" placeholder="输入充能值" />
						<view class="custom-energy-zero" hover-class="custom-energy-zero-hover"
							@click="customEnergy_plusmn">
							<view class="custom-energy-plusmn">±</view>
						</view>
					</view>
				</view>
				<!-- 自定义充能效率 -->
				<view class="skill-row extra">
					<view class="custom-energy">
						<view class="custom-energy-left"><text>自定义充能效率：</text></view>
						<input class="custom-energy-right" type="digit" v-model="customEnergyEfficiency"
							placeholder="输入充能效率" />
						<view class="custom-energy-percent">%</view>
						<view class="custom-energy-zero" hover-class="custom-energy-zero-hover"
							@click="customEnergyEfficiency_plusmn">
							<view class="custom-energy-plusmn">±</view>
						</view>
					</view>
				</view>
				<!-- 自定义额外充能 -->
				<view class="skill-row extra">
					<view class="custom-energy">
						<view class="custom-energy-left"><text>自定义额外充能：</text></view>
						<input class="custom-energy-right" type="number" v-model="customExtraEnergy"
							placeholder="输入额外充能" />
						<view class="custom-energy-zero" hover-class="custom-energy-zero-hover"
							@click="customExtraEnergy_plusmn">
							<view class="custom-energy-plusmn">±</view>
						</view>
					</view>
				</view>

				<view v-for="(effect, effectName) in extraEffects" :key="effectName">
					<view class="skill-row">
						<switch @change="handleActivation(effect)" :checked="effect.active" color="#007ffc" />
						<view class="skill-name extra"><text>{{ effectName }}</text></view>
						<view class="level-cell"
							:class="{ 'level-cell-selected': (effect.selectedLevel||1) === index + 1 }"
							hover-class="level-cell-hover" v-if="effect.levels[0] > 1"
							v-for="(level,index) in effect.levels.slice(1)" :key="level.level"
							@click="selectLevel(effect, index)">
							<text>{{ level.level }}</text>

						</view>
					</view>
					<view class="skill-description extra" v-if="effect.active">
						<text>{{ getSkillDescription(effect) }}</text>
					</view>
				</view>
			</view>
		</view>


		<!-- 行动选择部分 -->
		<view class="block" v-if="currentCharacter">
			<!-- 第一行：已选择的行动 -->
			<view class="selected-actions">
				<view class="selected-action" hover-class="selected-action-hover"
					v-for="(count, action) in selectedActions" :key="action" @click="delAction(action)">
					<text>{{ actionNames[action] }}{{ count }}次</text>
				</view>
			</view>
			<view class="hint-left" v-if="Object.keys(selectedActions).length > 0">点击行动以删除</view>
			<view class="action-clear" hover-class="action-clear-hover" @click="clearActions">清空</view>
			<!-- 第二行：可选择的行动 -->
			<view class="available-actions">
				<view class="available-action" hover-class="available-action-hover" v-for="action in availableActions"
					:key="action" @click="addAction(action)" v-if="isActionAvailable(action)">
					<text>{{ actionNames[action] }}</text>
				</view>
			</view>
		</view>
		<!--计算结果-->
		<view class="block" v-if="currentCharacter">
			<view class="energy-row">
				<view class="energy-row-left"><text>回合数: {{ computedTurns }}</text></view>
				<text>额外充能值: {{ computedExtraEnergy }}</text>
			</view>
			<view class="energy-row">
				<view class="energy-row-left"><text>充能值: {{ computedEnergy }}</text></view>
				<text>充能效率: {{ computedEnergyEfficiencyPercent }}% </text>
			</view>
			<view class="final-energy">
				<view class="final-energy-color">
					<view class="final-energy-red"
						:class="{ 'final-energy-green':computedFinalEnergy >=computedEnergyMax}">
						<text>最终充能值：{{ computedFinalEnergy }} / {{ computedEnergyMax }}</text>
					</view>
				</view>
			</view>
			<view class="final-energy">
				<view class="energy-chargingNeeds"
					:class="{'energy-chargingNeeds-green':computedEnergyChargingNeeds <= 0}"
					hover-class="energy-chargingNeeds-hover">
					<view><text>充能缺口：</text></view>
					<view><text>{{ computedEnergyChargingNeeds }}</text></view>
				</view>
				<view class="energy-chargingNeeds"
					:class="{'energy-chargingNeeds-green':computedEnergyEfficiencyNeeds < 19.45}"
					hover-class="energy-chargingNeeds-hover" @click="showChargingTable">
					<view><text>充能效率需求：</text></view>
					<view><text>{{ computedEnergyEfficiencyNeedsStr }}%</text></view>
					<image class="energy-charging-icon" src="/static/question-line.png" />
				</view>
			</view>
			<view class="final-energy">

			</view>
			<view class="hint">
				最终充能值 = 充能值 × 充能效率 + 额外充能值
			</view>
		</view>

		<!--充能绳主词条数值一览-->
		<view v-if="isChargingTable" class="popup-overlay" @click="closeChargingTable">
			<view class="popup" @click.stop>
				<view class="charging-table-title">五星充能绳数值一览</view>
				<view class="popup-content">
					<view class="charging-table-row">
						<view class="charging-table-header">等级</view>
						<view class="charging-table-header">充能效率</view>
					</view>
					<view class="charging-table-row" v-for="(efficiency, index) in efficiencies" :key="index">
						<view class="charging-table-cell">{{ index }}</view>
						<view class="charging-table-cell">{{ efficiency }}</view>
					</view>
					<view class="hint"> 数值仅供参考 </view>
					<view class="hint"> 以实际游戏为准 </view>
				</view>

			</view>
		</view>

		<view class="version">
			<view class="hint">充能计算器 {{version}}</view>
		</view>

		<view class="opensource">
			<view class="opensource-tap" hover-class="opensource-tap-hover" @click="HSRchargingCalculator()">
				<view class="opensource-hint">本页面开源于</view>
				<image class="opensource-icon" src="../../static/github-fill.png"></image>
				<view class="opensource-hint">HSRchargingCalculator</view>
			</view>
		</view>
	</view>
</template>

<script>
	import data from './data.json';

	export default {
		data() {
			return {
				testtext: '',
				types: data.types,
				selectedType: '同谐', // 当前选择的类型
				selectedCharacter: null, // 当前选择的角色名字
				selectedLightCone: null, // 当前选择的光锥名字
				currentCharacter: null, // 当前选择的角色数据
				currentLightCone: null, // 当前选择的光锥数据
				characters: {}, // 当前选择的类型对应的角色列表
				lightCones: {}, // 当前选择的类型对应的光锥列表
				extraEffects: data.extraEffects, // 额外效果列表
				selectedExtraEffect: null, // 当前选择的额外效果名字
				currentExtraEffect: null, // 当前选择的额外效果数据
				isExtraEffectsExpanded: true, // 控制额外效果展开/收起的状态
				selectedActions: {}, // 记录已选择的行动及其次数
				initialEnergy: 5, // 初始能量，默认为5
				customEnergy: 0, // 用户输入的自定义充能值
				customEnergyEfficiency: 0, // 用户输入的自定义充能效率值
				customExtraEnergy: 0, // 用户输入的自定义额外充能值
				actionView: 0, // 用于刷新行动输入栏
				actionNames: {
					"skill": "战技",
					"basicATK": "普通攻击",
					"singleAttacked": "受到单体攻击",
					"groupAttacked": "受到群体攻击",
					"enemyKill": "击杀敌人",
					"followUp": "追加攻击",
					"ultimate": "终结技",
					"special": "特殊",
					"special_1": "特殊(2)",
					"special_2": "特殊(3)",
					"special_3": "特殊(4)"
				},
				availableActions: [
					"skill", "basicATK", "singleAttacked", "groupAttacked", "enemyKill", "followUp", "ultimate",
					"special", "special_1", "special_2", "special_3"
				],
				turns: 0, // 记录回合数
				energy: 0, // 记录充能值
				energyEfficiency: 1, // 初始充能效率为100% (1)
				extraEnergy: 0, // 额外充能值
				finalEnergy: 0, // 最终充能值

				isChargingTable: false,
				efficiencies: [
					"3.11%", "4.20%", "5.29%", "6.38%", "7.46%", "8.55%", "9.64%", "10.73%", "11.82%", "12.91%",
					"14.00%", "15.08%", "16.17%", "17.26%", "18.35%", "19.44%"
				],

				reset: 1,

				version: "beta4"

			};
		},
		onShareAppMessage() {
			return {
				title: '《崩坏:星穹铁道》充能计算器',
				imageUrl: '/static/preview-1.jpg'
			}
		},
		computed: {
			typeNames() {
				return Object.keys(this.types);
			},
			characterNames() {
				return Object.keys(this.characters);
			},
			lightConeNames() {
				return ['无', ...Object.keys(this.lightCones)];
			},
			// 计算初始能量
			computedInitialEnergy() {
				// 如果是0.5，返回角色能量上限的50%
				if (this.initialEnergy === 0.5) {
					if (this.currentCharacter.energyMax) {
						return this.currentCharacter.energyMax * 0.5;
					} else {
						return data.defaultTemplate.energyMax * 0.5;
					}
				}
				// 否则直接返回初始能量值
				return 5;
			},
			// 计算回合数
			computedTurns() {
				let turns = 0;
				if (this.selectedActions.skill) turns += this.selectedActions.skill;
				if (this.selectedActions.basicATK) turns += this.selectedActions.basicATK;
				return turns;
			},
			// 计算充能值
			computedEnergy() {
				let energy = 0;
				for (const action in this.selectedActions) {
					energy += this.getEffectValue(action) * this.selectedActions[action];
					energy += this.getATKvalue(action) * this.selectedActions[action];
				}
				if (this.computedInitialEnergy == 5) {
					energy += this.computedInitialEnergy;
				}
				energy += +this.customEnergy || 0;
				energy += this.getEffectValue('energy') +
					(this.getEffectValue('turnStart') + this.getEffectValue('turnEnd')) * this.computedTurns;
				if (Math.abs(energy - +energy.toFixed(0)) < 0.01) energy = +energy.toFixed(0);
				else energy = +energy.toFixed(2);

				return energy;
			},
			// 计算充能效率
			computedEnergyEfficiency() {
				let efficiency = 0;
				efficiency += (+this.customEnergyEfficiency / 100) || 0;
				efficiency += this.getEffectValue('energyEfficiency');
				return efficiency;
			},
			computedEnergyEfficiencyPercent() {
				let efficiency = this.computedEnergyEfficiency * 100;
				if (Math.abs(efficiency - +efficiency.toFixed(0)) < 0.01) efficiency = +efficiency.toFixed(0);
				else efficiency = +efficiency.toFixed(2);
				return efficiency;
			},
			// 计算额外充能值
			computedExtraEnergy() {
				let extra = 0;
				if (this.computedInitialEnergy != 5) {
					extra += this.computedInitialEnergy;
				}
				extra += this.getEffectValue('extraEnergy');
				extra += +this.customExtraEnergy || 0;
				if (Math.abs(extra - +extra.toFixed(0)) < 0.01) extra = +extra.toFixed(0);
				else extra = +extra.toFixed(2);
				return extra;
			},

			// 计算最终充能值
			computedFinalEnergy() {
				let energy = 0;
				energy = this.computedEnergy * this.computedEnergyEfficiency + this.computedExtraEnergy;

				if (Math.abs(energy - +energy.toFixed(0)) < 0.01) energy = +energy.toFixed(0);
				else energy = +energy.toFixed(2);

				return energy;
			},
			// 计算充能缺口
			computedEnergyChargingNeeds() {
				let needs = 0;
				let energy = this.computedEnergyMax - this.computedExtraEnergy;
				needs = (energy - this.computedEnergy) / this.computedEnergyEfficiency;
				needs = +needs.toFixed(1);
				if (needs < 0) {
					needs = 0;
				}
				return needs;
			},
			// 计算充能效率需求
			computedEnergyEfficiencyNeeds() {
				let needs = 0;
				let energy = this.computedEnergyMax - this.computedExtraEnergy;
				needs = (energy / this.computedEnergy) || -1;
				needs = needs * 100 - 100;
				needs = +needs.toFixed(1);
				return needs;
			},
			computedEnergyEfficiencyNeedsStr() {
				let needs = this.computedEnergyEfficiencyNeeds;
				if (Math.abs(needs) > 300) return '- ';
				else if (needs < 0) return 0;
				else return needs;
			},
			computedEnergyMax() {
				return this.currentCharacter.energyMax || data.defaultTemplate.energyMax;
			}
		},
		watch: {
			currentCharacter() {
				this.computedEnergy;
				this.computedEnergyEfficiency;
				this.computedExtraEnergy;
				this.actionView++;
			},
			currentLightCone() {
				this.computedEnergy;
				this.computedEnergyEfficiency;
				this.computedExtraEnergy;
				this.actionView++;
			},
			extraEffects() {
				this.computedEnergy;
				this.computedEnergyEfficiency;
				this.computedExtraEnergy;
				this.actionView++;
			},
		},
		created() {
			// 如果默认的类型存在
			if (this.types[this.selectedType]) {
				this.characters = this.types[this.selectedType].characters;
				this.lightCones = this.types[this.selectedType].lightCones || {};

				// 默认选择角色列表中的第一个角色
				const characterKeys = Object.keys(this.characters);
				if (characterKeys.length > 0) {
					this.selectedCharacter = characterKeys[0];
					this.currentCharacter = this.characters[this.selectedCharacter];
				}

				// 默认选择光锥为 "无"
				this.selectedLightCone = "无";
			}
		},
		methods: {
			test() {
				this.testtext = ','
				this.testtext += JSON.stringify(this.currentCharacter) + '\n' +
					JSON.stringify(this.currentLightCone);
				console.log(this.availableActions);
			},
			async handleTypeSelection(typeName) {
				this.selectedType = typeName;
				this.characters = this.types[this.selectedType].characters;
				this.lightCones = this.types[this.selectedType].lightCones || {};

				for (let skill in this.currentCharacter.skills) {
					await this.$set(this.currentCharacter.skills[skill], "active", true);
				} // 强迫微信小程序重新渲染

				this.selectedCharacter = Object.keys(this.characters)[0];
				this.currentCharacter = this.characters[this.selectedCharacter];

				for (let skill in this.currentCharacter.skills) {
					await this.$set(this.currentCharacter.skills[skill], "active", false);
				} // 强迫微信小程序重新渲染

				// 默认选择光锥为 "无"
				this.selectedLightCone = "无";
				this.currentLightCone = null;

				this.reset = 1;
			},
			handleCharacterChange(e) {
				this.selectedCharacter = this.characterNames[e.mp.detail.value];
				this.currentCharacter = this.characters[this.selectedCharacter];
			},
			handleLightConeChange(e) {
				if (e.mp.detail.value === 0) {
					this.selectedLightCone = '无';
					this.currentLightCone = null;
				} else {
					this.selectedLightCone = this.lightConeNames[e.mp.detail.value];
					this.currentLightCone = this.lightCones[this.selectedLightCone];
				}
			},
			handleExtraEffectChange(e) {
				this.selectedExtraEffect = this.extraEffectNames[e.mp.detail.value];
				this.currentExtraEffect = this.extraEffects[this.selectedExtraEffect];
			},
			handleActivation(e) {
				if (!e.active) {
					this.$set(e, 'active', true);
				} else {
					this.$set(e, 'active', false);
				}
			},
			// 微信小程序移动端无法输入负号
			customEnergy_plusmn() {
				this.customEnergy = - +this.customEnergy || 0;
			},
			customEnergyEfficiency_plusmn() {
				this.customEnergyEfficiency = - +this.customEnergyEfficiency || 0;
			},
			customExtraEnergy_plusmn() {
				this.customExtraEnergy = - +this.customExtraEnergy || 0;
			},
			showChargingTable() {
				this.isChargingTable = true;
			},
			closeChargingTable() {
				this.isChargingTable = false;
			},
			selectLevel(levels, level) {
				this.$set(levels, 'selectedLevel', level + 1);
			},
			toggleExtraEffects() {
				this.isExtraEffectsExpanded = !this.isExtraEffectsExpanded;
			},
			getSkillDescription(skill) {
				const effectDescriptions = {
					"skill": "战技充能+",
					"basicATK": "普通攻击充能+",
					"singleAttacked": "受到单体攻击充能+",
					"groupAttacked": "受到群体攻击充能+",
					"enemyKill": "击杀敌人充能+",
					"followUp": "追加攻击充能+",
					"ultimate": "使用终结技后充能+",
					"energyEfficiency": "充能效率增加",
					"extraEnergy": "额外充能+",
					"energy": "充能+",
					"ATK": "攻击敌人后充能+",
					"turnStart": "回合开始时充能+",
					"turnEnd": "回合结束时充能+",
					// 可能还有其他效果描述
					"special": "特殊充能+",
					"special_1": "特殊(2)充能+",
					"special_2": "特殊(3)充能+",
					"special_3": "特殊(4)充能+",
				};

				const level = skill.levels[skill.selectedLevel] || skill.levels[1];
				const descriptions = [];

				for (const effect in effectDescriptions) {
					if (level[effect] && level[effect] !== 0) {
						if (effect === "energyEfficiency") {
							let energy = level[effect] * 100;
							if (Math.abs(energy - +energy.toFixed(0)) < 0.01) energy = +energy.toFixed(0);
							else energy = +energy.toFixed(2);
							descriptions.push(`${effectDescriptions[effect]}${energy}%`); // 由于充能效率是小数，转换为百分比
						} else {
							descriptions.push(`${effectDescriptions[effect]}${level[effect]}`);
						}
					}
				}

				let fullDescription = descriptions.join(", ");
				if (skill.description) {
					fullDescription = `${skill.description} : ${fullDescription}`;
				}

				return fullDescription;
			},
			// 设置初始能量
			setInitialEnergy(value) {
				this.$set(this, 'initialEnergy', value);
			},
			// 检查行动是否可用（不为null）
			isActionAvailable(action) {
				// 检查当前角色
				if (this.currentCharacter[action] || data.defaultTemplate[action]) {
					return true;
				}

				if (this.currentCharacter.ATK.includes(action)) {
					return true;
				}

				// 检查角色技能
				if (this.currentCharacter.skills)
					for (let skillName in this.currentCharacter.skills) {
						let skill = this.currentCharacter.skills[skillName];
						if ((skill.alwaysActive || skill.active) && skill.levels[1][action]) {
							return true;
						}
					}

				// 检查当前光锥
				if (this.currentLightCone && (this.currentLightCone.alwaysActive || this.currentLightCone.active)) {
					if (this.currentLightCone.levels[1][action]) {
						return true;
					}
				}

				// 检查额外效果
				for (const effectName in this.extraEffects) {
					const effect = this.extraEffects[effectName];
					if ((effect.alwaysActive || effect.active) && effect.levels[1][action]) {
						return true;
					}
				}

				// 如果以上检查都没有返回true，则最终返回false
				return false;
			},
			// 添加行动
			addAction(action) {
				if (!this.selectedActions[action]) {
					this.$set(this.selectedActions, action, 1);
				} else {
					this.selectedActions[action]++;
				}
			},
			// 删除行动
			delAction(action) {
				if (this.selectedActions[action]) {
					if (this.selectedActions[action] > 1) {
						this.selectedActions[action]--;
					} else {
						this.$delete(this.selectedActions, action);
					}
				}
			},
			// 清空已选择的行动
			clearActions() {
				this.selectedActions = {};
			},
			getEffectValue(key) {
				let value = 0;
				// 从角色模板中获取值
				if (this.currentCharacter && this.currentCharacter[key] != undefined) {
					value += this.currentCharacter[key];
				}

				// 从默认模板中获取值
				else if (data.defaultTemplate[key]) {
					value += data.defaultTemplate[key];
				}
				// 从角色技能中获取值
				if (this.currentCharacter.skills)
					for (const skill in this.currentCharacter.skills) {
						if (this.currentCharacter.skills[skill].alwaysActive || this.currentCharacter.skills[skill]
							.active) {
							let levelindex = this.currentCharacter.skills[skill].selectedLevel || 1;
							let level = this.currentCharacter.skills[skill].levels[levelindex];
							value += level[key] || 0;
						}
					}
				// 从光锥中获取值
				if (this.currentLightCone && (this.currentLightCone.alwaysActive || this.currentLightCone.active)) {
					let levelindex = this.currentLightCone.selectedLevel || 1;
					let level = this.currentLightCone.levels[levelindex];
					value += level[key] || 0;
				}

				// 从额外效果中获取值
				for (const effectKey in this.extraEffects) {
					const effectObj = this.extraEffects[effectKey];
					if (effectObj.active) {
						let levelindex = effectObj.selectedLevel || 1;
						let level = effectObj.levels[levelindex];
						value += level[key] || 0;
					}
				}

				return value;
			},
			getATKvalue(action) {
				let value = 0;
				let list = this.currentCharacter.ATK || [];
				if (!list.includes(action)) {
					return 0;
				}
				// 从角色技能中获取值
				if (this.currentCharacter.skills)
					for (const skill in this.currentCharacter.skills) {
						if (this.currentCharacter.skills[skill].alwaysActive || this.currentCharacter.skills[skill]
							.active) {
							let levelindex = this.currentCharacter.skills[skill].selectedLevel || 1;
							let level = this.currentCharacter.skills[skill].levels[levelindex]
							value += level['ATK'] || 0;
						}
					}
				// 从光锥中获取值
				if (this.currentLightCone && (this.currentLightCone.alwaysActive || this.currentLightCone.active)) {
					let levelindex = this.currentLightCone.selectedLevel || 1;
					let level = this.currentLightCone.levels[levelindex];
					value += level['ATK'] || 0;
				}

				// 从额外效果中获取值
				for (const effectKey in this.extraEffects) {
					const effectObj = this.extraEffects[effectKey];
					if (effectObj.active) {
						let levelindex = effectObj.selectedLevel || 1;
						let level = effectObj.levels[levelindex]
						value += level['ATK'] || 0;
					}
				}

				return value;
			},

			// ... 其他方法

			HSRchargingCalculator() {
				uni.navigateTo({
					url: '/pages/chargingCalculator/license'
				})
			}
		}
	};
</script>

<style scss>
	/* 这里放置您的样式 */
	.container {
		padding: 20rpx;
		background-color: #F0F0F0;
	}

	.type-selection {
		display: flex;
		justify-content: center;
		margin-bottom: 20rpx;
	}

	.type {
		padding: 10rpx 20rpx;
		background-color: #FFF;
		border: 1rpx solid #00b4ff;
	}

	.type {
		padding: 10rpx 20rpx;
		background-color: #FFF;
		border: 1rpx solid #007ffc;
	}

	.type-selected {
		color: #FFF;
		background-color: #007ffc;
		border: 1rpx solid #007ffc;
	}

	.type:first-child {
		border-radius: 25rpx 0 0 25rpx;
	}

	.type:last-child {
		border-radius: 0 25rpx 25rpx 0;
	}

	.block {
		background-color: #FFF;
		margin: 20rpx 0;
		padding: 20rpx;
		border-radius: 50rpx;
	}

	.picker-container {
		border-bottom: 1rpx solid #c8c8c8;
	}

	.picker {
		display: flex;
		padding: 10rpx;
		margin: 10rpx;
		margin-top: 0;
		border-radius: 16rpx;
	}

	.picker-hover {
		background-color: #dcdcdc;
	}

	.picker-left {
		padding: 0 20rpx;
		border-right: 1rpx solid #7f7f7f;
	}

	.picker-right {
		flex: 1;
		padding: 0 20rpx;
	}

	.character-info {
		margin: 10rpx 20rpx;
		display: flex;
	}

	.character-info-cell {
		padding: 0 20rpx;
		margin: 10rpx 0;
	}

	.character-info-cell:not(:last-child) {
		border-right: 1rpx solid #c8c8c8;
	}

	.character-skill {
		padding: 10rpx 0;
	}

	switch {
		transform: scale(0.75)
	}

	.skill-row {
		display: flex;
		align-items: center;
		padding: 10rpx 20rpx;
		border-top: 1rpx solid #c8c8c8;
	}

	.switch-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.skill-name {
		font-size: 34rpx;
		margin-right: 10rpx;
		display: flex;
		align-items: center;
	}

	.level-cell {
		padding: 5rpx 6rpx;
		min-width: 30rpx;
		text-align: center;
		color: #FFF;
		background-color: #b4b4b4;
		border: 0.5rpx solid #787878;
		border-radius: 7rpx;
		margin: 0 8rpx
	}

	.level-cell-hover {
		background-color: #dcdcdc;
	}

	.level-cell-selected {
		color: #FFF;
		background-color: #007ffc;
		border-color: #0067c8;
	}

	.level-cell-selected-hover {
		background-color: #0067c8;
	}

	.skill-description {
		color: #646464;
		margin-left: 20rpx;
	}

	.picker-container.lightCone-row {
		border: 0;
	}

	.picker.extra {
		padding: 10rpx 40rpx;
	}

	.skill-row.extra {
		padding: 15rpx 40rpx;
	}

	.initial-energy {
		width: 215rpx;
		margin-right: 20rpx;
		border-right: 2rpx solid #7f7f7f;
	}

	.custom-energy {
		display: flex;
		align-items: center;
	}

	.custom-energy-right {
		width: 180rpx;
		border: 1rpx solid #a0a0a0;
		border-radius: 15rpx;
		padding: 5rpx 15rpx;
	}

	.custom-energy-percent {
		margin-left: 10rpx;
	}

	.custom-energy-zero {
		width: 35rpx;
		height: 35rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFF;
		background-color: #007ffc;
		border: 0.5rpx solid #0067c8;
		border-radius: 8rpx;
		margin-left: 25rpx;
	}

	.custom-energy-zero-hover {
		background-color: #0067c8;
	}

	.custom-energy-plusmn {
		margin-top: -5rpx;
	}

	.skill-description.extra {
		margin-top: -5rpx;
		margin-bottom: 15rpx;
	}

	.skill-name.extra {
		min-width: 150rpx;
	}

	.selected-actions {
		display: flex;
		margin: 10rpx 20rpx;
		min-height: 100rpx;
		border: 1rpx solid #a0a0a0;
		border-radius: 20rpx;
		padding: 10rpx 15rpx;
		flex-flow: row wrap;
		justify-content: flex-start;
	}

	.selected-action {
		padding: 5rpx 10rpx;
		margin-right: 10rpx;
		margin: 5rpx;
		background-color: #c3e3ff;
		border: 1rpx solid #007ffc;
		border-radius: 15rpx;
		height: 45rpx;
	}

	.selected-action-hover {
		background-color: #9bd1ff;
	}

	.action-clear {
		margin: 10rpx auto;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 360rpx;
		height: 100rpx;
		color: #FFF;
		background-color: #007ffc;
		border-radius: 30rpx;
	}

	.action-clear-hover {
		background-color: #0072dc;
	}

	.available-actions {
		display: flex;
		margin: 10rpx 20rpx;
		min-height: 100rpx;
		flex-flow: row wrap;
		justify-content: flex-start;
		border-radius: 20rpx;
		padding: 10rpx 15rpx;
		background-color: #e9e9e9;
	}

	.available-action {
		padding: 5rpx 10rpx;
		margin-right: 10rpx;
		margin: 5rpx;
		background-color: #ebf6ff;
		border: 1rpx solid #007ffc;
		border-radius: 15rpx;
	}

	.available-action-hover {
		background-color: #c3e4ff;
	}

	.energy-row {
		padding: 15rpx 30rpx;
		display: flex;
	}

	.energy-row-left {
		min-width: 200rpx;
	}

	.final-energy {
		display: flex;
		justify-content: space-between;
		margin: 5rpx 10rpx;
	}

	.final-energy-color {
		display: flex;
		align-items: center;
	}

	.final-energy-red {
		padding: 10rpx 20rpx;
		border-radius: 25rpx;
		border: 1rpx solid #dc8687;
		background-color: #ffc3c5;
	}

	.final-energy-green {
		border: 1rpx solid #86dc94;
		background-color: #c3ffcd;
	}

	.energy-chargingNeeds {
		margin-top: 15rpx;
		padding: 10rpx 20rpx;
		display: flex;
		align-items: center;
		border-radius: 25rpx;
		background-color: #ffe1e3;
	}

	.energy-chargingNeeds-green {
		background-color: #e1ffe6;
	}

	.energy-chargingNeeds-hover {
		padding: 8rpx 18rpx;
		border: 1rpx solid #b4b4b4;
	}

	.energy-charging-icon {
		margin-left: 15rpx;
		width: 40rpx;
		height: 40rpx;
	}

	.popup-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.popup {
		background: white;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
		width: 450rpx;
		overflow-y: auto;
		border-radius: 50rpx;
	}

	.popup-content {
		padding: 30rpx;
	}

	.charging-table-title {
		width: 100%;
		height: 100rpx;
		font-weight: bold;
		color: white;
		border-radius: 50rpx 50rpx 0 0;
		background-color: #007ffc;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.charging-table-row {
		margin: 0 auto;
		width: 80%;
		display: flex;
		justify-content: center;
	}

	.charging-table-header {
		flex: 1;
		font-weight: bold;
		border: 1px solid black;
		text-align: center;
	}

	.charging-table-cell {
		flex: 1;
		border: 1px solid black;
		text-align: center;
		padding: 5rpx 0;
	}


	.version {
		padding-top: 20rpx;
	}

	.hint {
		text-align: center;
		color: #787878;
	}

	.hint-left {
		margin-left: 20rpx;
		color: #787878;
	}

	.opensource {
		margin-top: 20rpx;
		display: flex;
		justify-content: center;
	}

	.opensource-tap {
		display: flex;
		justify-content: center;
		padding: 20rpx;
		border-radius: 20rpx;
		background-color: #ffffff;
	}

	.opensource-tap-hover {
		background-color: #dcdcdc;
	}

	.opensource-hint {
		color: #787878;
		margin: 0 5rpx
	}

	.opensource-icon {
		width: 40rpx;
		height: 40rpx;
	}
</style>