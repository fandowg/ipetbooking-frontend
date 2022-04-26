<script>
import lazyLoadComponent from '@router/lazyload-component'

export default {
  components: {
    BaseCollapse: () => lazyLoadComponent(import('@components/BaseCollapse')),
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    isEditMode() {
      return this.defaultValue.id
    },
    isEmptyByOrderExtrafields() {
      return this.defaultValue.byOrderExtrafields instanceof Array || this.defaultValue.byOrderExtrafields === undefined
    },
    isEmptyBySizeExtrafields() {
      if (this.defaultValue.customerInfos.length === 0) return true
      return this.defaultValue.customerInfos[0].bySizeExtrafields instanceof Array
    },
  },
  created() {
    if (this.isEditMode) {
      this.watchComplexObject(this.defaultValue.byOrderExtrafields)
      this.defaultValue.customerInfos.map((customerInfo) => {
        this.watchComplexObject(customerInfo.bySizeExtrafields)
      })
    }
  },
  methods: {
    watchComplexObject(Extrafields) {
      if (!this.isEmptyExtrafields(Extrafields)) {
        for (let index in Extrafields) {
          this.$watch(() => Extrafields[index], this.updateExtrafields, {
            deep: true,
          })
        }
      }
    },
    isEmptyExtrafields(Extrafields) {
      return Extrafields instanceof Array
    },
    updateExtrafields(newValue, oldValue) {
      newValue.edited = true
    },
  },
}
</script>

<template>
  <div>
    <div v-if="!isEmptyByOrderExtrafields" class="info-byOrder">
      <!-- <div class="el-form-item__label">參與資訊</div> -->
      <el-form-item
        v-for="(byOrderExtrafields, byOrderExtrafieldsIndex) in defaultValue.byOrderExtrafields"
        :key="`edit-byOrderExtrafields-${byOrderExtrafieldsIndex}`"
        :label="byOrderExtrafields.title"
        :class="$style['extra-field']"
      >
        <el-input v-model="byOrderExtrafields.value" type="text"></el-input>
      </el-form-item>
    </div>

    <div v-if="!isEmptyBySizeExtrafields" class="info-bySize">
      <div class="el-form-item__label">參與人資訊</div>
      <BaseCollapse
        v-for="(customerInfo, index) in defaultValue.customerInfos"
        :key="`edit-customerInfo-${index}`"
        :title="`參與人 ${index + 1}`"
        :class="$style['border']"
      >
        <el-form-item
          v-for="(field, fieldIndex) in customerInfo.bySizeExtrafields"
          :key="`edit-customerInfo-${index}-${fieldIndex}`"
          :label="field.title"
          :class="$style['extra-field']"
        >
          <el-input v-model="field.value" type="text"></el-input>
        </el-form-item>
      </BaseCollapse>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.border {
  border: 2px solid lightgray;
  border-radius: 4px;
  margin-bottom: 15px;
  > div {
    background: transparent;
  }
}
.extra-field {
  :global {
    .el-form-item__label {
      // padding: 0;
      font-size: small;
    }
  }
}
</style>
