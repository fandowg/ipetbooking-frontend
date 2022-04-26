<script>
import { taxTypeMap, carrierTypeMap } from '@utils/filter-value-to-text'
export default {
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
    showSync: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      taxTypeMap,
      carrierTypeMap,
    }
  },
  computed: {
    carrierNumExample() {
      if (this.defaultValue.CarrierType === '1') return '例：AB01234567898765'
      else return '例：/ABC+123'
    },
  },
  created() {
    // this.defaultValue.saveTaxInfo = 1
  },
  methods: {
    onTaxTypeChange() {
      this.defaultValue.CarrierType = ''
      this.defaultValue.CarrierNum = ''
      this.defaultValue.taxId = ''
      this.defaultValue.LoveCode = ''
    },
  },
}
</script>
<template>
  <div>

        <el-form-item label="開立類型" prop="taxType" :rules="[{ required: true, message: '請選擇開立類型', trigger: 'change' }]">
          <el-select v-model="defaultValue.taxType" @change="onTaxTypeChange">
            <el-option v-for="(title, type) in taxTypeMap" :key="type" :value="type" :label="title"></el-option>
          </el-select>
        </el-form-item>



        <el-form-item v-if="defaultValue.taxType === 'B2C'" label="載具類別" prop="CarrierType">
          <el-select v-model="defaultValue.CarrierType" @change="defaultValue.CarrierNum = ''">
            <el-option :value="null" label="無（寄送電子發票至客戶 email）"></el-option>
            <el-option :value="'0'" label="手機條碼"></el-option>
            <el-option :value="'1'" label="自然人憑證條碼"></el-option>
            <el-option :value="'2'" label="ezPay 電子發票載具"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="defaultValue.taxType === 'B2C' && ['0', '1'].includes(defaultValue.CarrierType)"
          label="載具編號"
          prop="CarrierNum"
          :rules="[
            { required: !isNaN(defaultValue.CarrierType), message: '請輸入載具編號', trigger: 'blur' },
            { pattern: defaultValue.CarrierType === '0' ? /^\/[\dA-Z0-9+-\.]{7}$/ : /^[A-Z]{2}[0-9]{14}$/, message: '格式不正確', trigger: 'blur' },
          ]"
        >
          <el-input v-model="defaultValue.CarrierNum" :placeholder="carrierNumExample"></el-input>
        </el-form-item>
        <el-form-item
          v-if="defaultValue.taxType === 'B2B'"
          label="統一編號"
          prop="taxId"
          :rules="[
            { required: true, message: '請輸入統一編號', trigger: 'blur' },
            { required: true, pattern: /^[0-9]{8}$/, message: '格式不正確', trigger: 'blur' },
          ]"
        >
          <el-input v-model="defaultValue.taxId" placeholder="請輸入統一編號"></el-input>
        </el-form-item>
        <el-form-item
          v-if="defaultValue.taxType === 'DONATE'"
          label="捐贈碼"
          prop="LoveCode"
          :rules="[
            { required: true, message: '請輸入捐贈碼', trigger: 'blur' },
            { required: true, pattern: /^\d{3,7}$/, message: '格式不正確', trigger: 'blur' },
          ]"
        >
          <el-input v-model="defaultValue.LoveCode" placeholder="請輸入捐贈碼">
            <el-link slot="append" target="_blank" href="https://www.einvoice.nat.gov.tw/APCONSUMER/BTC603W/">查詢捐贈碼</el-link>
          </el-input>
        </el-form-item>
        <el-form-item v-if="showSync" prop="saveTaxInfo">
          <el-checkbox v-model="defaultValue.saveTaxInfo" :false-label="0" :true-label="1">將此發票資訊同步儲存至客戶管理</el-checkbox>
        </el-form-item>
 
  </div>
</template>
<style lang="scss" module>
</style>
