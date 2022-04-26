<script>
import { taiwanCitys, districtsFilter } from '@utils/filter-value-to-text'

export default {
  props: {
    itemIndex: {
      type: Number,
      default: 0,
    },
    defaultValue: {
      type: Object,
      default: () => {},
    },
    citys: {
      type: Array,
      required: true,
    },
    showRemove: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      taiwanCitys,
      submitData: Object.assign(
        {
          city: '',
          region: [],
        },
        this.defaultValue
      ),
    }
  },
  computed: {
    districts() {
      return districtsFilter(this.defaultValue.city)
    },
  },
  methods: {
    onSelectCity(type) {
      this.defaultValue.district = []
    },
    onRemove() {
      this.$emit('remove', this.itemIndex)
    },
  },
}
</script>

<template>
  <el-card style="margin-bottom: 20px;">
    <el-form-item :prop="'addressRestrictions.' + itemIndex + '.city'" :rules="{ required: true, message: '請選擇縣市' }" label="縣市" style="margin-top: 20px;">
      <el-select v-model="defaultValue.city" placeholder="請選擇縣市" @change="onSelectCity">
        <el-option v-for="(city, index) in citys" :key="`member-city-${index}`" :label="city.name" :value="city.name"> </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :prop="'addressRestrictions.' + itemIndex + '.district'" :rules="{ required: true, message: '請選擇區域' }" label="區域（可複選）" style="margin-bottom: 20px;">
      <el-select v-model="defaultValue.district" placeholder="請選擇鄉鎮市區" multiple>
        <el-option v-for="(district, index) in districts" :key="`member-district-${index}`" :label="district.name" :value="district.name"> </el-option>
      </el-select>
    </el-form-item>
    <el-button v-if="showRemove" class="is-round" type="danger" @click="onRemove"><BaseIcon name="trash-alt"></BaseIcon> 移除</el-button>
  </el-card>
</template>
