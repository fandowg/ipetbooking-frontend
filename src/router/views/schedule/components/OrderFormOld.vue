<script>
// 資料的部分比較多，所以和畫面分開
// SearchMember 做會員的搜尋以及新增修改
// PetSelect 做寵物的選擇以及寵物新增修改
import orderFormData from './orderFormData'

export default orderFormData
</script>
<template>
  <div :class="$style.wrapper">
    <SearchMember
      ref="SearchMember"
      :submit-rules="submitRules"
      :sync-member-info.sync="memberInfo"
      :is-edit-mode="isEditMode"
      :member-info-show="memberInfoShow"
      :edit-customer-enabled.sync="editCustomerEnabled"
      :member-data-not-yet.sync="memberDataNotYet"
      @updateMemberInfo="updateMemberInfo"
    />
    <template v-if="memberInfoShow && !editCustomerEnabled">
      <div class="infoList__row">
        <el-row :gutter="20">
          <el-col :span="24" class="infoList__title"> 使用人 <el-checkbox v-model="userSameAsMember" class="check-by-head">使用人同客戶</el-checkbox></el-col>
          <el-col :span="24" class="infoList__item">
            <el-form ref="form" :model="submitData" :rules="submitRules" label-position="top" class="el-form-item--normal-margin el-form-item--white-bg">
              <el-row :gutter="20">
                <el-col :md="12" class="infoList__item">
                  <el-form-item prop="fullName" label="" style="margin-bottom: 0">
                    <el-input v-model="submitData.fullName" :disabled="userSameAsMember" placeholder="姓名">
                      <el-select slot="append" v-model="submitData.gender" :disabled="userSameAsMember" placeholder="性別">
                        <el-option value="female" label="小姐"></el-option>
                        <el-option value="male" label="先生"></el-option>
                      </el-select>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :md="12" class="infoList__item">
                  <el-form-item prop="phoneNumber" style="margin-bottom: 0">
                    <el-input v-model="submitData.phoneNumber" :disabled="userSameAsMember" placeholder="手機號碼" autocomplete="tel">
                      <CountryCodePicker slot="prepend" v-model="submitData.phoneCode" :disabled="userSameAsMember" />
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </template>

    <template v-if="memberInfoShow && !memberDataNotYet">
      <div style="border-top: 1px solid #dcdfe6; margin-top: 20px; padding-top: 30px">
        <el-button class="is-round isInputGroup" :class="{ isActive: orderMode === 'single' }" @click="orderSingle">單次預約</el-button>
        <el-button class="is-round isInputGroup" :class="{ isActive: orderMode === 'prepaid' }" @click="orderPrepaid">包月方案預約</el-button>
        <div style="padding-top: 30px">
          <OrderSingle
            v-if="orderMode === 'single'"
            ref="order"
            :sync-submit-data.sync="submitData"
            :submit-rules="submitRules"
            :products="products"
            :selected-pet-size-id.sync="selectedPetSizeId"
            :member-info="memberInfo"
            :member-info-show="memberInfoShow"
            :default-value="defaultValue"
            :available-prepaid-list="availablePrepaidList"
            :selected-prepaid="selectedPrepaid"
            :is-edit-mode="isEditMode"
            :coupon-info="couponInfo"
            :param-size-total="paramSizeTotal"
            :param-price-total="paramPriceTotal"
            :params-with-no-qty="paramsWithNoQty"
            :submit-price-total="submitPriceTotal"
            :is-home-service="isHomeService"
            @validCoupon="validCoupon"
            @resetCoupon="resetCoupon"
            @scrollDrawer="scrollDrawer"
          >
          <template v-slot:petSelect>
            <PetSelect
                ref="PetSelect"
                :selected-pet-size-id.sync="selectedPetSizeId"
                :member-info="memberInfo"
                :submit-data="submitData"
                :member-info-show="memberInfoShow"
                @scrollDrawer="scrollDrawer"
              />
          </template>
          </OrderSingle>
          <OrderPrepaid
            v-if="orderMode === 'prepaid'"
            ref="order"
            :sync-submit-data.sync="submitData"
            :sync-submit-data-prepaid.sync="submitDataPrepaid"
            :member-info="memberInfo"
            :prepaid-price.sync="prepaidPrice"
            :submit-rules="submitRules"
            :products="products"
            :selected-pet-size-id.sync="selectedPetSizeId"
            :member-info-show="memberInfoShow"
            :default-value="defaultValue"
            :available-prepaid-list="availablePrepaidList"
            :param-size-total="paramSizeTotal"
            :param-price-total="paramPriceTotal"
            :params-with-no-qty="paramsWithNoQty"
            :is-edit-mode="isEditMode"
            :is-home-service="isHomeService"
            @scrollDrawer="scrollDrawer"
          >
          <template v-slot:petSelect>
            <PetSelect
                ref="PetSelect"
                :selected-pet-size-id.sync="selectedPetSizeId"
                :member-info="memberInfo"
                :submit-data="submitData"
                :member-info-show="memberInfoShow"
                @scrollDrawer="scrollDrawer"
              />
          </template>
          </OrderPrepaid>
     
       
        </div>
      </div>
    </template>

    <Portal to="drawer-header-order">
      <el-button class="is-round" type="primary" :loading="tryingStore" :disabled="tryingStore || !memberInfoShow || !orderMode" @click="handleStoreOrder">新增訂單</el-button>
    </Portal>
    <OrderChangeStatusDialog :visible.sync="statusDialogVisible" :order="submitData" :prepaid-order="submitDataPrepaid" @paid="handlePaidStatus" @cancelled="emitStore" />
  </div>
</template>
<style lang="scss" module>
@import '@design';
.wrapper {
  border-top: 1px solid $color-border-base;
  padding-top: 15px;
  :global {
    .el-form-item__label {
      @extend %font-heading;
    }
  }
}

:global {
  .infoList {
    &__title {
      font-weight: 500;
      margin-bottom: 20px;
    }
    &__item {
      margin-bottom: 15px;
    }
    &__row {
      margin-bottom: 20px;
    }
  }
}

.customer {
  margin-bottom: 15px;
}

.search-form {
  margin-bottom: 15px;
  // border-bottom: 1px solid $color-border-base;
}

.title:not(:first-child) {
  margin-top: 30px;
}

.info {
  padding-inline-start: 0;
  > li {
    padding: 5px 0;
  }
}

.params {
  &-options {
    display: flex;
    justify-content: space-between;

    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
  &-list {
    padding: 5px 15px;
    background: white;
    &__item {
      display: flex;
      justify-content: space-between;

      &:first-child {
        color: $color-text-placeholder;
      }
      > * {
        flex: 1;
        &:first-child {
          flex: 2;
        }
        &:not(:first-child) {
          text-align: right;
        }
      }
    }
  }
}

.total {
  border-top: 1px solid $color-border-base;
  &__item {
    display: flex;
    justify-content: space-between;

    &--discount {
      color: $color-state-danger;
    }
    &:not(.total__item--discount) > *:first-child {
      color: $color-text-placeholder;
    }
  }
}
.payment-methods {
  :global {
    .el-radio {
      margin: 5px !important;
    }
    .vacc-disabled::after {
      content: '(服務前一日不提供)';
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      color: #c2c6ce;
    }
  }
}
</style>
