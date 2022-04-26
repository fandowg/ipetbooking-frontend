<script>
import orderFormData from './orderFormData'

export default orderFormData
</script>
<template>
  <div :class="$style.orderformSection">
    <div v-if="totalAllShow" class="orderformSection__all">
      <div class="orderformSection__right" style="border-right: #dcdfe6 1px solid">
        <div class="orderformSection__right__header">
          <button class="el-drawer__close-btn" aria-label="close drawer" type="button" @click.stop="isChildren ? closeChildren() : closeTotalAll()"
            ><i class="el-dialog__close el-icon el-icon-close"></i
          ></button>
          <h4 class="orderformSection__right__title">
            <div class="inline-between" style="padding-right: 15px; align-items: center">
              <span v-if="isChildren"> 新增子訂單 </span>
              <span v-else> 價格編輯與折扣 </span>
            </div>
          </h4>
        </div>

        <div class="orderformSection__right__content" style="padding: 0 0 20px 0">
          <!-- 打開都一樣，主訂單和子訂單的table分開 -->
          <TotalTable
            :is-main-order="isMainOrder"
            :is-children="isChildren"
            :delete-ids.sync="deleteIds"
            :adds.sync="adds"
            :is-edit-mode="isEditMode"
            :is-paid="isPaid"
            :has-coupon-info="hasCouponInfo"
            :order-params.sync="submitData.params"
            :order-total-edit-list.sync="totalEditList"
            :order-add-list.sync="addList"
            :service-total="serviceTotal"
            :coupon-price-total="couponPriceTotal"
            :submit-price-total="submitPriceTotal"
            :children-order-total="childrenOrderTotal"
            :coupon-info="couponInfo"
            :submit-data="submitData"
            :submit-data-prepaid="submitDataPrepaid"
            :current-buy-prepaid="currentBuyPrepaid"
            :more-items.sync="moreItems"
            :have-items.sync="haveItems"
            style="height: calc(100% - 10px)"
            @openAdd="openAddEdit"
            @openTotalEdit="openTotalEdit"
          >
            <div :class="$style.bottom">
              <template v-if="isChildren">
                <div class="children__bottom">
                  <div style="display: flex; margin-bottom: 10px">
                    <h6>付款方式</h6><el-checkbox v-model="submitData.allowExpired" class="check-by-head text-muted-0" :false-label="0" :true-label="1">可逾期付款</el-checkbox>
                  </div>
                  <el-radio-group v-model="paymentWay">
                    <el-radio label="offline" :disabled="ordertype === 'prepaid-order' && !isBuyPrepaid && !isPrepaidAndEdit" border>線下付款</el-radio>
                    <el-radio label="online" :disabled="ordertype === 'prepaid-order' && !isBuyPrepaid && !isPrepaidAndEdit" border>線上付款</el-radio>
                  </el-radio-group>
                  <el-button
                    style="margin-top: 20px; width: 100%"
                    class="is-round orderformSection__bottom__btn"
                    type="primary"
                    :disabled="tryingStore || (addList.length === 0 && totalEditList.length === 0)"
                    :loading="tryingStore"
                    @click="handleStoreOrder('children')"
                    >新增子訂單</el-button
                  >
                </div>
              </template>
              <template v-else>
                <!-- 未付款前編輯訂單可以變更優惠 -->
                <el-form
                  v-if="!isPaid && serviceTotal > 0 && !submitData.prepaidOrderUuid && !submitDataPrepaid.prepaidId && addOrderIndex === 'main'"
                  ref="couponForm"
                  :model="submitData"
                  :rules="submitRules"
                >
                  <el-form-item ref="couponCode" class="el-form-item--white-bg" prop="couponCode">
                    <el-input v-model="submitData.couponCode" clearable :disabled="!!hasCouponInfo" placeholder="請輸入優惠券代碼">
                      <el-button v-if="hasCouponInfo" slot="append" @click="resetCoupon">清除優惠券</el-button>
                      <el-button v-else slot="append" @click="validCoupon">使用優惠券</el-button>
                    </el-input>
                  </el-form-item>
                </el-form>

                <div class="btn-group-inline">
                  <!-- <el-button plain class="is-round" @click="cancelToTalEdit">取消</el-button> -->
                  <!-- 新增 -->
                  <el-button v-if="!isEditMode" class="is-round" type="primary" @click="saveTotalEdit">儲存</el-button>
                  <!-- 編輯 -->
                  <el-button v-else class="is-round" type="primary" @click="editOrderItem">儲存</el-button>
                </div>
              </template>
            </div>
          </TotalTable>
        </div>
      </div>
      <div class="orderformSection__left" style="border: 0">
        <div class="orderformSection__left__content" style="padding-bottom: 0">
          <TotalEdit v-if="!addShow" @update:totalEditList="addTotalEdit"></TotalEdit>

          <div v-else>
            <!-- <template v-if="isEditMode">
         
              <div class="orderformSection__right__header">
                <button class="el-drawer__close-btn" aria-label="close drawer" type="button" @click.stop="closeAdd"><i class="el-dialog__close el-icon el-icon-close"></i></button>
                <h4 class="orderformSection__right__title">
                  <div class="inline-between" style="padding-right: 15px; align-items: center">
                    加購
                  
                  </div>
                </h4>
              </div>
              <div class="info-section">
                <Addition  
                  :pet-size-id="petSizeId" 
                  :is-edit-mode="true" 
                  :schedule-detail="scheduleDetail"
                  :schedules="schedules"
                  :default-value="isEditMode ? defaultValue : submitData" 
                  @update="$emit('update')"
                />
              </div>
            </template> -->

            <div class="orderformSection__right__header">
              <button class="el-drawer__close-btn" aria-label="close drawer" type="button"  @click.stop="closeAdd"
                ><i class="el-dialog__close el-icon el-icon-close"></i
              ></button>
              <h4 class="orderformSection__right__title">
                <div class="inline-between" style="padding-right: 15px; align-items: center"> 加購 </div>
              </h4>
            </div>
            <div class="info-section">
              <!-- scheduleDetail編輯時要換 -->
              <AdditionForm
                ref="addForm"
                :is-edit-mode="isEditMode"
                :add-list.sync="addList"
                :pet-size-id="petSizeId"
                :default-value.sync="isEditMode ? defaultValue : submitData"
                :schedule-detail="scheduleDetail"
                :schedules="schedules"
                :current-service="currentService"
                :is-children="isChildren"
                @prepaidAndEdit="prepaidAndEdit"
                @addMore="addMore"
                @close="closeAdd"
              />
              <!-- @update="updateDefaultValue" -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="prepaidAllShow" class="orderformSection__all">
      <div class="orderformSection__right" style="border-right: #dcdfe6 1px solid">
        <div class="orderformSection__right__header">
          <button class="el-drawer__close-btn" aria-label="close drawer" type="button" @click.stop="closePrepaidAll"><i class="el-dialog__close el-icon el-icon-close"></i></button>
          <h4 class="orderformSection__right__title">
            <div class="inline-between" style="padding-right: 15px; align-items: center">
              <span v-if="isBuyPrepaid">購買包月方案</span><span v-else>可使用包月方案</span>
              <el-button v-if="!isBuyPrepaid" type="text" style="padding-top: 0; padding-bottom: 0; text-decoration: underline" @click="goToBuyPrepaid"> 購買包月方案 </el-button>
            </div>
          </h4>
        </div>

        <div class="orderformSection__right__content">
          <!-- 使用包月 -->
          <template v-if="filteredAvailablePrepaidList.length > 0 && !isBuyPrepaid">
            <div v-for="item in filteredAvailablePrepaidList" :key="item.id" :class="[$style.price, { isActive: currentPrepaid.id === item.id },{ isDisabled: item.status !== 1 }]" style="cursor: pointer" @click="goToPrepaid(item)">
              <el-image class="image price__image" :src="item.image" fit="cover">
                <div slot="error">
                  <BaseIcon name="image" class="image--error" />
                </div>
              </el-image>
              <div class="price__cont">
                <div>
                  <div class="price__title">
                    <div v-if="multipleStore" style="padding-bottom: 5px">{{ item.storeTitles.join('，') }} </div> {{ item.prepaidTitle }}
                  </div>
                  <div class="text-muted-0" style="line-height: 1.6">
                    可抵用次數：{{ item.times - item.used }}/{{ item.times }}<br />
                    到期日：{{ item.expiredDate ? item.expiredDate : '' | formatDate }}{{ item.expiredDate ? '' : '無使用期限' }}
                    <div v-if="item.status === 2" class="alert-text"> 未付款</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <el-alert
            v-if="filteredAvailablePrepaidList.length === 0 && !isBuyPrepaid"
            title="目前選擇的寵物與服務人員無適用之包月方案，請調整購買數量、建議顧客購買新的包月方案"
            type="warning"
            :closable="false"
          ></el-alert>
          <!-- 購買包月 -->
          <template v-if="filterPrepaidList.length > 0 && isBuyPrepaid">
            <div v-for="item in filterPrepaidList" :key="item.id" :class="[$style.price, { isActive: currentBuyPrepaid.id === item.id }]" style="cursor: pointer" @click="selectBuyingPrepaid(item)">
              <el-image class="image price__image" :src="item.image" fit="cover">
                <div slot="error">
                  <BaseIcon name="image" class="image--error" />
                </div>
              </el-image>
              <div class="price__cont">
                <div>
                  <div class="price__title">
                    <div v-if="multipleStore" style="padding-bottom: 5px">{{ item.stores.join('，') }} </div> {{ item.title }}
                  </div>
                  <div class="text-muted-0" style="line-height: 1.6">
                    可抵用次數：{{ item.times }}<br />
                    價格：{{ item.price }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="orderformSection__left" style="border: 0">
        <div class="orderformSection__left__content info-section">
          <!-- 使用包月 -->
          <div v-if="currentPrepaid.id && !isBuyPrepaid" :class="$style.prepaid">
            <el-image class="image prepaid__image" :src="currentPrepaid.image" fit="cover">
              <div slot="error">
                <BaseIcon name="image" class="image--error" />
              </div>
            </el-image>
            <!-- {{currentPrepaid}} -->
            <div class="inline-between" style="margin-bottom: 40px">
              <span class="prepaid__title">
                <span v-if="multipleStore">
                  {{ currentPrepaid.storeTitles.join('，') }}
                </span>
                {{ currentPrepaid.prepaidTitle }}
              </span>
              <span class="text-muted-0">可抵用次數：{{ currentPrepaid.times - currentPrepaid.used }}/{{ currentPrepaid.times }}</span>
            </div>
            <div style="margin-bottom: 30px">
              <h6>可使用服務項目</h6>
              <div class="el-form-item--white-bg">
                <div style="display: flex">
                  <el-select v-model="currentService" value-key="id">
                    <el-option v-for="(item, index) in filteredServicesByPrepaid" :key="item.id" :value="item" :label="`${item.storeTitle} ${item.name} `">
                      <span>{{ `${item.storeTitle} ${item.name}` }}</span>
                      <span class="select__option--meta">{{ `(尚餘${item.maxTimes - item.used}次)` }}</span>
                    </el-option>
                  </el-select>
                  <el-button class="is-round" style="margin-left: 20px" :disabled="!currentService" @click="selectPrepaidService">使用方案</el-button>
                </div>
              </div>
            </div>
            <div v-if="currentPrepaid.slogan" style="margin-bottom: 30px">
              <h6>優惠內容</h6>
              <p>{{ currentPrepaid.slogan }}</p>
            </div>
            <div v-if="currentPrepaid.description" style="margin-bottom: 30px">
              <h6>方案內容說明</h6>
              <p>{{ currentPrepaid.description }}</p>
            </div>
            <div v-if="currentPrepaid.notice" style="margin-bottom: 30px">
              <h6>注意事項</h6>
              <p>{{ currentPrepaid.notice }}</p>
            </div>
          </div>
          <!-- 購買包月 -->
          <div v-if="isBuyPrepaid && currentBuyPrepaid.id" :class="$style.prepaid">
            <el-image class="image prepaid__image" :src="currentBuyPrepaid.image" fit="cover">
              <div slot="error">
                <BaseIcon name="image" class="image--error" />
              </div>
            </el-image>
            <!-- {{filteredServicesByBuyingPrepaid}} -->
            <!-- {{currentBuyPrepaid}} -->
            <div class="inline-between" style="margin-bottom: 40px">
              <span class="prepaid__title">
                <span v-if="multipleStore">
                  {{ currentBuyPrepaid.stores.join('，') }}
                </span>
                {{ currentBuyPrepaid.title }}
              </span>
              <span class="text-muted-0">可抵用次數：{{ currentBuyPrepaid.times }}</span>
            </div>
            <div style="margin-bottom: 30px">
              <h6>可使用服務項目</h6>
              <div class="el-form-item--white-bg">
                <div style="display: flex">
                  <el-select v-model="currentService" value-key="id">
                    <el-option v-for="(item, index) in filteredServicesByBuyingPrepaid" :key="item.id" :value="item" :label="`${item.storeTitle} ${item.title} `">
                      <span>{{ `${item.storeTitle} ${item.title}` }}</span>
                      <span class="select__option--meta">{{ `(可抵用次數${item.maxTimes}次)` }}</span>
                    </el-option>
                  </el-select>
                  <el-button class="is-round" style="margin-left: 20px" :disabled="!currentService" @click="selectBuyingPrepaidService">使用方案</el-button>
                </div>
              </div>
            </div>
            <div v-if="currentBuyPrepaid.slogan" style="margin-bottom: 30px">
              <h6>優惠內容</h6>
              <p>{{ currentBuyPrepaid.slogan }}</p>
            </div>
            <div v-if="currentBuyPrepaid.description" style="margin-bottom: 30px">
              <h6>方案內容說明</h6>
              <p>{{ currentBuyPrepaid.description }}</p>
            </div>
            <div v-if="currentBuyPrepaid.notice" style="margin-bottom: 30px">
              <h6>注意事項</h6>
              <p>{{ currentBuyPrepaid.notice }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!prepaidAllShow && !totalAllShow" class="orderformSection__all">
      <div class="orderformSection__left">
        <div id="orderHeader" :class="$style.header">
          <el-alert v-if="!isEditMode && scheduleDetail.showExpiredAlert" type="warning" :title="'請注意，您選擇的時段已經過期！'" :closable="false"></el-alert>
          <h5 class="Jost" :class="$style.title">此時段服務地點：{{ isEditMode ? defaultValue.productName : scheduleDetail.storesTitle }}</h5>
          <template v-if="isEditMode ? defaultValue.scheduleItem : scheduleDetail.name">
            <h5 class="Jost"
              >美容師：{{ isEditMode ? defaultValue.scheduleItem.name : scheduleDetail.name }}
              <template v-if="!isEditMode">
                {{ scheduleDetail.state === 0 ? '(停權中)' : '' }}
              </template>
            </h5>

            <template v-if="isEditMode">
              <div v-if="defaultValue.status === 6" :class="$style.editOneLine" style="margin-top: 15px padding:0  20px">
                <h5 class="editOneLine__title">助理：</h5>
                <span class="editOneLine__text">{{ defaultValue.helper ? defaultValue.helper.name : '不指派' }} </span>
              </div>

              <div v-else v-loading="tryingAssign" element-loading-background="rgba(0, 0, 0,0)" :class="$style.editOneLine" style="margin-top: 15px padding:0  20px">
                <h5 class="editOneLine__title">助理：</h5>
                <template v-if="editAssistantEnabled">
                  <el-form ref="assistantForm" class="el-form--floating" style="width: 200px">
                    <el-form-item label="" class="el-form-item--normal-margin">
                      <el-select v-model="submitData.helper.id">
                        <!-- <el-option label="不指派" value></el-option> -->
                        <el-option label="不指派" value></el-option>
                        <el-option v-for="(item, index) in assignList" :key="index" :value="item.id" :label="`${item.name} ${item.sameStore ? '(同分店)' : '(不同分店)'}`">
                          {{ item.name }} ({{ item.sameStore ? '同分店' : '不同分店' }})
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                </template>
                <template v-if="!editAssistantEnabled">
                  <span v-if="assignList.length > 0 && !defaultValue.helper" class="editOneLine__text">請選擇</span>
                  <span v-if="!tryingAssign && assignList.length === 0 && !defaultValue.helper" class="editOneLine__text">目前無人員可指派 </span>
                  <span v-if="defaultValue.helper" class="editOneLine__text">{{ defaultValue.helper.name }} </span>
                </template>
                <template v-if="assignList.length > 0">
                  <template v-if="!editAssistantEnabled">
                    <el-button class="is-round" size="mini" @click="openAssignEdit">
                      <BaseIcon name="edit" />
                      <span>編輯</span>
                    </el-button>
                  </template>
                  <template v-else>
                    <el-button class="is-round" @click="cancelAssignEdit">
                      <!-- <BaseIcon name="times" />  -->
                      取消
                    </el-button>
                    <el-button class="is-round" type="primary" :loading="tryingAssign" @click="tryToStoreAssignHelper">
                      <!-- <BaseIcon name="check" />  -->
                      儲存
                    </el-button>
                  </template>
                </template>
              </div>
            </template>
          </template>

          <h5 class="Jost">預約時間：{{ isEditMode ? editOrderDate : scheduleDetail.date | formatDate('dateTime') }}</h5>
        </div>
        <div ref="leftCont" class="orderformSection__left__content" :style="`height:calc(100vh - ${headerHeight}px)`">
          <div v-if="mamberSearchShow && !isEditMode" class="search-section">
            <el-tabs v-model="activeSearchType" stretch>
              <el-tab-pane label="快速搜尋" name="short">
                <div v-loading="tryingGetMember" element-loading-background="rgba(0, 0, 0, 0)" class="search-box__wrapper">
                  <el-form ref="searchFormByShort" class="el-form-item--normal-margin el-form-item--white-bg search-box" :model="filterData" @submit.native.prevent>
                    <el-form-item>
                      <span slot="label">快速查詢客戶 <span class="text-muted-0">(請輸入末三碼)</span></span>
                      <el-autocomplete ref="autocomplete" v-model="filterData.search" style="width: 100%" :fetch-suggestions="searchQuery" @select="selectMember">
                        <template v-slot="{ item }">
                          <span class="info-line-box">
                            <span v-if="searchNone" class="add-box"> 查無會員，立刻新增會員 <BaseIcon name="plus"></BaseIcon> </span>
                            <template v-else>
                          
                              <span class="info-line title">{{ item.fullName }}</span>
                              <!-- <span class="info-line">{{ item.gender | genderFilter }}</span> -->
                              <span class="info-line content">{{ item.phoneNumber }}</span>
                              <span class="info-line more-content">{{memberPets(item)}}</span>
                            </template>
                            
                          </span>
                        </template>
                      </el-autocomplete>
                      <!-- <el-input v-model.trim="filterData.search" placeholder="請輸入手機末三碼" @keyup.native.enter="validPhoneNumber"> </el-input> -->
                    </el-form-item>
                    <el-button class="is-round is-fullwidth isPrimaryOutLine" @click="searchQueryByBtn">查詢</el-button>
                    <el-button style="margin-left: 0" type="text" @click="creatMember">新增客戶</el-button>
                  </el-form>
                </div>
              </el-tab-pane>
              <el-tab-pane label="電話搜尋" name="phone">
                <div class="search-box__wrapper">
                  <el-form ref="searchFormByPhone" class="el-form-item--normal-margin el-form-item--white-bg search-box" :model="searchData" :rules="searchRules">
                    <el-form-item prop="phoneNumber">
                      <span slot="label">查詢客戶 </span>
                      <el-input v-model.trim="searchData.phoneNumber" placeholder="請輸入手機號碼" @keyup.native.enter="validPhoneNumber">
                        <CountryCodePicker slot="prepend" v-model="searchData.phoneCode" />
                      </el-input>
                    </el-form-item>
                    <el-button class="is-round is-fullwidth isPrimaryOutLine" @click="validPhoneNumber">查詢</el-button>
                    <span v-if="isNewMember" class="alert-word" style="margin-top: 20px; display: block">查無客戶資訊，快速建立客戶</span>
                  </el-form>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div v-if="!mamberSearchShow" v-loading="tryingGetMember" element-loading-background="rgba(0, 0, 0,0)" style="min-height: 300px; padding-top: 20px" class="info-section">
            <template v-if="memberInfo.id">
              <!-- 客戶資訊 -->
              <template>
                <BaseCollapse expanded is-order :order-theme="true">
                  <template v-slot:title>
                    <span><BaseIcon icon-style="fal" name="address-card" /> 客戶資訊</span>
                  </template>

                  <div>
                    <el-button v-if="!isEditMode" class="is-round isPrimaryOutLine" style="margin-bottom: 20px" @click="clearMemberInfo">重新搜尋</el-button>
                    <!-- <h6> <BaseIcon icon-style="fal" name="address-card" /> 客戶資訊</h6> -->
                    <div :class="$style.infoList">
                      <div class="infoList__row">
                        <el-row :gutter="20">
                          <!-- <el-col :span="24" class="infoList__title"> 客戶資訊</el-col> -->
                          <el-col :span="24">
                            <el-row :gutter="20" type="flex">
                              <el-col :span="24" :md="12" class="infoList__item">
                                <el-button type="text" style="padding-top: 0; text-decoration: underline" @click="goToDetail">
                                  {{ memberInfo.fullName }} {{ memberInfo.gender | genderFilter }}
                                </el-button>
                              </el-col>
                              <el-col :span="24" :md="12" class="infoList__item"> {{ `${memberInfo.phoneCode} ${memberInfo.phoneNumber}` }}</el-col>

                              <el-col :span="24" :md="12" class="infoList__item">
                                <template v-if="memberInfo.tags.length > 0">
                                  <el-tag v-for="tag in memberInfo.tags" :key="`tag-${tag.id}`" :type="'info'" effect="plain" disable-transitions>
                                    {{ tag.title }}
                                  </el-tag>
                                </template>
                                <template v-else>
                                  <span class="muted"> 目前尚無標籤</span>
                                </template>
                              </el-col>

                              <el-col :span="24" :md="12" class="infoList__item">LINE ID: {{ memberInfo.lineId }} </el-col>
                            </el-row>
                          </el-col>
                        </el-row>
                      </div>
                      <div class="infoList__row">
                        <el-row :gutter="20">
                          <el-col :span="24" class="infoList__title"> 內部備註</el-col>
                          <el-col :span="24" class="infoList__item">
                            <span v-if="memberInfo.merchantNote" class="muted" v-html="memberInfo.merchantNote"></span>
                            <span v-else>目前尚無備註</span>
                          </el-col>
                        </el-row>
                      </div>
                      <!-- <div class="only-bottom-line" style="margin-bottom: 30px"></div> -->
                    </div>
                  </div>
                </BaseCollapse>
              </template>
           
              <!-- 寵物資訊 -->
              <template>
                <BaseCollapse expanded is-order :order-theme="true">
                  <template v-slot:title>
                    <span><BaseIcon name="dog" /> 寵物資訊 </span>
                  </template>

                  <div v-if="!isEditMode" style="padding-bottom: 30px">
                    <el-button v-if="!submitData.petId" class="is-round is-fullwidth" style="margin-top: 0" @click="openSelectPet">選擇寵物</el-button>
                    <template v-else>
                      <div class="inline-between" style="margin-top: 0">
                        寵物資訊
                        <el-button type="text" style="padding-top: 0; text-decoration: underline" @click="openSelectPet"> 重選寵物 </el-button>
                      </div>
                      <div class="el-form-item--white-bg">
                        <el-input v-model="selectPetCont" :readonly="true" />
                      </div>
                    </template>
                  </div>
                  <div v-else style="margin-bottom: 30px">
                    <ul :class="$style.box">
                      <li>{{ defaultValue.pet.name }}</li>
                      <li v-if="defaultValue.pet.birthday">{{ defaultValue.pet.birthday }}</li>
                      <li v-if="defaultValue.pet.breed">{{ defaultValue.pet.breed }}</li>
                      <li v-if="defaultValue.pet.gender">{{ defaultValue.pet.gender === 'male' ? '公' : '母' }}</li>
                      <li>{{ defaultValue.pet.categoryTitle }}/{{ defaultValue.pet.sizeTitle }}</li>

                      <li v-if="defaultValue.pet.note" class="row-line">{{ defaultValue.pet.note }}</li>

                      <template v-if="defaultValue.pet.questions">
                        <li v-if="defaultValue.pet.questions" class="row-line"></li>
                        <li v-if="defaultValue.pet.questions.personality.length > 0" class="row-line">個性：{{ personalityContentOrder }}</li>
                        <li v-if="defaultValue.pet.questions.healthy.length > 0" class="row-line">健康狀況：{{ healthyContentOrder }}</li>
                        <li v-if="defaultValue.pet.questions.behavior.length > 0" class="row-line indentList">
                          <span class="title">行為：</span>
                          <template v-if="behaviorContentOrder.length > 0">
                            <span class="content">
                              <span v-for="n in behaviorContentOrder" :key="n" class="content__item">{{ n }}</span>
                            </span>
                          </template>
                        </li>
                        <li v-if="defaultValue.pet.questions.vaccine" class="row-line">疫苗：{{ vaccineContentOrder }}</li>
                        <!-- 疫苗：{{ defaultValue.pet.questions.vaccine ? vaccineContent : '未填寫' }} -->
                      </template>
                    </ul>
                    <div class="btn-group-inline" style="margin-bottom: 20px">
                      <el-button v-if="commentList.length !== 0" plain class="is-round" @click="openCommentList">查看歷史備註</el-button>
                      <el-button class="is-round" type="primary" @click="openCommentEdit"><BaseIcon name="plus" /> 新增寵物備註</el-button>
                    </div>
                    <PetCommentList ref="comment" type="order" :order="defaultValue" @emitFetch="emitCommentFetch" />
                    <el-dialog :visible.sync="petCommentDialogVisible" :pet="defaultValue.pet.id" title="寵物備註" width="800px" top="0" append-to-body>
                      <PetCommentList ref="commentAll" :pet="defaultValue.pet.id" type="pet" :order="defaultValue" />
                    </el-dialog>
                  </div>
                </BaseCollapse>
              </template>
              <!-- 服務項目 -->
              <template v-if="petSizeId || isEditMode">
                <BaseCollapse expanded is-order :order-theme="true">
                  <template v-slot:title>
                    <span><BaseIcon name="cut" /> 服務項目</span>
                  </template>
                  <div v-if="!isEditMode">
                    <div class="btn-group-inline" style="margin-bottom: 30px; padding-top: 0">
                      <el-button class="is-round isInputGroup" :class="{ isActive: ordertype === 'order' }" @click="onSelectOrderType('order')">單次預約</el-button>
                      <el-button class="is-round isInputGroup" :class="{ isActive: ordertype === 'prepaid-order' }" @click="onSelectOrderType('prepaid-order')">包月方案預約</el-button>
                    </div>
                    <template v-if="submitData.params[0].priceId">
                      <div class="inline-between" style="margin-top: 30px">
                        服務項目
                        <el-button type="text" style="padding-top: 0; text-decoration: underline" @click="reSelectOrder"> 重新選擇 </el-button>
                      </div>
                      <div class="el-form-item--white-bg">
                        <el-input v-model="currentServiceCont" :readonly="true" />
                      </div>
                    </template>
                  </div>
                  <div v-else style="margin-bottom: 30px">
                    <div style="margin-bottom: 30px" :class="$style.titleBox">{{ mainService.title }}</div>

                    <div class="inline-between" style="margin-bottom: 10px">
                      <span style="font-weight: 500">服務備註</span>
                      <el-button type="text" style="padding-top: 0; text-decoration: underline" @click="openNoteEdit"> 編輯備註 </el-button>
                    </div>
                    <div style="font-weight: 500; margin-bottom: 10px">使用人資訊</div>
                    <ul :class="$style.info" style="margin-bottom: 20px">
                      <li>{{ defaultValue.fullName }} {{ defaultValue.gender | genderFilter }}</li>
                      <li>{{ `${defaultValue.phoneCode} ${defaultValue.phoneNumber}` }}</li>
                      <li>{{ defaultValue.member.email }}</li>
                      <li v-if="defaultValue.member.lineId">LINE ID: {{ defaultValue.member.lineId }}</li>
                      <li v-if="defaultValue.note" style="display: block">使用人備註：{{ defaultValue.note || '目前尚無備註' }}</li>
                    </ul>

                    <div v-if="!isEmptyByOrderExtrafields">
                      <!-- <div style="font-weight:500;margin-bottom:15px" >服務資訊</div> -->
                      <ul v-for="(byOrderExtrafield, byOrderExtrafieldIndex) in defaultValue.byOrderExtrafields" :key="`byOrderExtrafieldIndex-${byOrderExtrafieldIndex}`" :class="$style.question">
                        <li style="margin-bottom: 10px">{{ byOrderExtrafield.title }}</li>
                        <li style="margin-bottom: 10px; color: #909399">{{ byOrderExtrafield.value }}</li>
                      </ul>
                    </div>
                  </div>
                </BaseCollapse>
              </template>
                 <!-- 到府專用地址 -->
              <template v-if="isHomeService">
                <BaseCollapse expanded is-order :order-theme="true">
                  <template v-slot:title>
                    <span><BaseIcon name="map-marker-alt" /> 服務地址</span>
                  </template>
                  <div style="margin-bottom:30px">
                    <div v-if="submitData.city" style="margin-bottom:20px">服務地址：{{ submitData.city }}{{ submitData.district }}{{ submitData.address }}</div>
                    <el-button v-if="!defaultValue.city" type="text" style="padding-top: 0; text-decoration: underline" @click="openAddressEdit"> 新增服務地址 </el-button>
                    <el-button v-else type="text" style="padding-top: 0; text-decoration: underline" @click="openAddressEdit"> 編輯服務地址 </el-button>
                  </div>
               
                </BaseCollapse>
              </template>
              <!-- 發票資訊 -->
              <template v-if="isEditMode && defaultValue.status === 6 && defaultValue.invoice.InvoiceNumber">
                <BaseCollapse is-order :order-theme="true">
                  <template v-slot:title>
                    <span> 發票資訊</span>
                  </template>
                  <div style="margin-bottom:30px">
                    <div :class="$style.invoice">
                      <!-- <div class="order-id Jost">{{ `${defaultValue.invoice.orderType === 'Order' ? '預約訂單' : '子訂單'} #${defaultValue.invoice.orderId}` }}</div> -->
                      <div style="margin-bottom:10px"> 預約訂單#{{defaultValue.id}}</div>
                      <div class="info">
                        <el-row :gutter="20">
                          <el-col :span="12" :xs="24">
                            <div class="info-item">
                              <span class="title">發票日期</span>
                              <span>{{ defaultValue.invoice.CreateTime | formatDate }}</span>
                            </div>
                            <div class="info-item">
                              <span class="title">發票號碼</span>
                              <span>{{ defaultValue.invoice.InvoiceNumber }}</span>
                            </div>
                            <div class="info-item">
                              <span class="title">隨機碼</span>
                              <span>{{ defaultValue.invoice.RandomNum }}</span>
                            </div>
                          </el-col>
                          <el-col :span="12" :xs="24">
                            <div class="info-item">
                              <span class="title">發票形式</span>
                              <span>{{ taxTypeMap[defaultValue.invoice.taxType] }}</span>
                            </div>
                            <div v-if="defaultValue.invoice.taxType === 'B2C'" class="info-item">
                              <span class="title">載具類別</span>
                              <span>{{ carrierTypeMap[defaultValue.invoice.CarrierType] }}</span>
                            </div>
                            <div v-if="defaultValue.invoice.taxType === 'B2C' && ['0', '1'].includes(defaultValue.invoice.CarrierType)" :span="12" :xs="24" class="info-item">
                              <span class="title">載具編號</span>
                              <span>{{ defaultValue.invoice.CarrierNum }}</span>
                            </div>
                            <div v-if="defaultValue.invoice.taxType === 'B2B'" class="info-item">
                              <span class="title">統一編號</span>
                              <span>{{ defaultValue.invoice.taxId }}</span>
                            </div>
                            <div v-if="defaultValue.invoice.taxType === 'DONATE'" class="info-item">
                              <span class="title">捐贈碼</span>
                              <span>{{ defaultValue.invoice.LoveCode }}</span>
                            </div>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                    <template v-if="childrenOrdersHaveInvoice.length > 0">
                    
                      <div v-for="addOrder in childrenOrdersHaveInvoice"  :key="addOrder.invoice.InvoiceNumber" :class="$style.invoice">
                        <!-- <div class="order-id Jost">{{ `${defaultValue.invoice.orderType === 'Order' ? '預約訂單' : '子訂單'} #${defaultValue.invoice.orderId}` }}</div> -->
                        <div style="margin-bottom:10px"> 子訂單#{{addOrder.id}}</div>
                        <div class="info">
                          <el-row :gutter="20">
                            <el-col :span="12" :xs="24">
                              <div class="info-item">
                                <span class="title">發票日期</span>
                                <span>{{ addOrder.invoice.CreateTime | formatDate }}</span>
                              </div>
                              <div class="info-item">
                                <span class="title">發票號碼</span>
                                <span>{{ addOrder.invoice.InvoiceNumber }}</span>
                              </div>
                              <div class="info-item">
                                <span class="title">隨機碼</span>
                                <span>{{ addOrder.invoice.RandomNum }}</span>
                              </div>
                            </el-col>
                            <el-col :span="12" :xs="24">
                              <div class="info-item">
                                <span class="title">發票形式</span>
                                <span>{{ taxTypeMap[addOrder.invoice.taxType] }}</span>
                              </div>
                              <div v-if="addOrder.invoice.taxType === 'B2C'" class="info-item">
                                <span class="title">載具類別</span>
                                <span>{{ carrierTypeMap[addOrder.invoice.CarrierType] }}</span>
                              </div>
                              <div v-if="addOrder.invoice.taxType === 'B2C' && ['0', '1'].includes(addOrder.invoice.CarrierType)" :span="12" :xs="24" class="info-item">
                                <span class="title">載具編號</span>
                                <span>{{ addOrder.invoice.CarrierNum }}</span>
                              </div>
                              <div v-if="addOrder.invoice.taxType === 'B2B'" class="info-item">
                                <span class="title">統一編號</span>
                                <span>{{ addOrder.invoice.taxId }}</span>
                              </div>
                              <div v-if="addOrder.invoice.taxType === 'DONATE'" class="info-item">
                                <span class="title">捐贈碼</span>
                                <span>{{ addOrder.invoice.LoveCode }}</span>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </div>
                    </template>
                  </div>
                </BaseCollapse>
              </template>
              <!-- 簽名 -->
              <BaseCollapse v-if="isEditMode && defaultValue.status === 6" is-order :order-theme="true">
                <template v-slot:title>
                  <span> 簽名</span>
                </template>
                <div style="margin-bottom:20px">
                <el-image :src="defaultValue.signature" :class="$style.image">
                  <div slot="error"> 圖片載入失敗 </div>
                </el-image>
                </div>
              </BaseCollapse>
            </template>
          </div>
        </div>
      </div>
      <div class="orderformSection__right">
        <template>
          <!-- 客戶編輯 -->
          <template v-if="editDetailEnabled">
            <div class="orderformSection__right__header">
              <button class="el-drawer__close-btn" aria-label="close drawer" type="button" @click="closeEditDetail"><i class="el-dialog__close el-icon el-icon-close"></i></button>
              <h4 class="orderformSection__right__title">{{ memberEditMode === 'new' ? '新增客戶' : '編輯客戶資訊' }}</h4>
            </div>
            <div class="orderformSection__right__content">
              <el-form ref="memberForm" :model="submitDataMember" :rules="memberRules" label-position="top" class="el-form-item--normal-margin el-form-item--white-bg">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item prop="fullName" label="姓名" class="el-form-item--normal-margin">
                      <el-input v-model="submitDataMember.fullName" placeholder="請輸入姓名"> </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="el-form-item--normal-margin gender-box" prop="gender">
                      <el-radio-group v-model="submitDataMember.gender" class="no-bg-radio-group">
                        <el-radio label="male">先生</el-radio>
                        <el-radio label="female">小姐</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item prop="phone" label="電話" class="el-form-item--normal-margin">
                      <el-input v-model.trim="submitDataMember.phone" placeholder="請輸入手機號碼" :disabled="memberEditMode === 'edit'">
                        <CountryCodePicker slot="prepend" v-model="submitDataMember.phoneCode" :disabled="memberEditMode === 'edit'" />
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="備用電話" class="el-form-item--normal-margin">
                      <el-input v-model.trim="submitDataMember.extraInfos.extraInfoPhone[0].phoneNumber" placeholder="請輸入備用電話">
                        <CountryCodePicker slot="prepend" v-model="submitDataMember.extraInfos.extraInfoPhone[0].phoneCode" />
                      </el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="24">
                    <el-form-item label="標籤" class="el-form-item--normal-margin">
                      <el-select v-model="submitDataMember.tags" value-key="id" multiple placeholder="請選擇">
                        <el-option v-for="tag in tagList" :key="tag.id" :label="tag.title" :value="tag"> </el-option> </el-select
                    ></el-form-item>
                  </el-col>

                  <el-col :span="24">
                    <el-form-item label="Email" prop="email">
                      <el-input v-model="submitDataMember.email" placeholder="Email"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="LINE ID">
                      <el-input v-model="submitDataMember.lineId" placeholder="LINE ID"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="緊急聯絡人姓名" class="el-form-item--normal-margin">
                      <el-input v-model="submitDataMember.extraInfos.extraInfoEmergency[0].fullName" placeholder="請輸入姓名"> </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="el-form-item--normal-margin gender-box">
                      <el-radio-group v-model="submitDataMember.extraInfos.extraInfoEmergency[0].gender" class="no-bg-radio-group">
                        <el-radio label="male">先生</el-radio>
                        <el-radio label="female">小姐</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="緊急聯絡人電話" class="el-form-item--normal-margin">
                      <el-input v-model.trim="submitDataMember.extraInfos.extraInfoEmergency[0].phoneNumber" placeholder="請輸入緊急聯絡人電話">
                        <CountryCodePicker slot="prepend" v-model="submitDataMember.extraInfos.extraInfoEmergency[0].phoneCode" />
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="內部備註" class="el-form-item--normal-margin">
                      <el-input v-model="submitDataMember.merchantNote" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" placeholder="請輸入你的備註文字"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div class="btn-group-inline" style="padding: 30px 0 50px">
                  <el-button plain class="is-round" @click="closeEditDetail">取消</el-button>
                  <el-button :loading="tryingSaveMember" :disabled="tryingSaveMember" class="is-round" type="primary" @click="tryToSaveDetail">儲存</el-button>
                </div>
              </el-form>
            </div>
          </template>
          <template v-if="memberInfoShow && !editDetailEnabled">
            <!-- 客戶資訊 -->
            <template>
              <div class="orderformSection__right__header">
                <button class="el-drawer__close-btn" aria-label="close drawer" type="button" @click="closeMemberInfo"><i class="el-dialog__close el-icon el-icon-close"></i></button>
                <el-tabs v-model="activeMemberData" stretch>
                  <el-tab-pane label="客戶資訊" name="information"> </el-tab-pane>
                  <el-tab-pane label="所有預約" name="orders"> </el-tab-pane>
                </el-tabs>
              </div>
              <div class="orderformSection__right__content">
                <div v-if="activeMemberData === 'information'">
                  <h4 class="form-block-title"
                    >基本資料

                    <el-button class="is-round" size="mini" @click="enableEditDetail">
                      <BaseIcon name="edit" />
                      <span>編輯</span>
                    </el-button>
                  </h4>
                  <ul :class="$style.detail">
                    <li>姓名：{{ memberInfo.fullName }} {{ memberInfo.gender | genderFilter }}</li>
                    <li>聯絡電話：{{ `${memberInfo.phoneCode} ${memberInfo.phoneNumber}` }}</li>
                    <li v-if="memberInfo.extraInfos && memberInfo.extraInfos.extraInfoPhone[0].phoneNumber">
                      備用電話：
                      {{ `${memberInfo.extraInfos.extraInfoPhone[0].phoneCode} ${memberInfo.extraInfos.extraInfoPhone[0].phoneNumber}` }}
                    </li>
                    <li v-if="memberInfo.extraInfos && memberInfo.extraInfos.extraInfoEmergency[0].fullName">
                      緊急聯絡人姓名：
                      {{ memberInfo.extraInfos.extraInfoEmergency[0].fullName }} {{ memberInfo.extraInfos.extraInfoEmergency[0].gender | genderFilter }}
                    </li>
                    <li v-if="memberInfo.extraInfos && memberInfo.extraInfos.extraInfoEmergency[0].phoneNumber">
                      緊急聯絡人電話：
                      {{ `${memberInfo.extraInfos.extraInfoEmergency[0].phoneCode} ${memberInfo.extraInfos.extraInfoEmergency[0].phoneNumber}` }}
                    </li>
                    <!-- <li v-if="memberInfo.extraInfos[0].phoneNumber">備用電話：{{ `${memberInfo.extraInfos[0].phoneCode} ${memberInfo.extraInfos[0].phoneNumber}` }}</li>

                  <li v-if="memberInfo.extraInfos[1].fullName">緊急聯絡人姓名：{{ memberInfo.extraInfos[1].fullName }}</li>
                  <li v-if="memberInfo.extraInfos[1].phoneNumber">緊急聯絡人電話：{{ `${memberInfo.extraInfos[1].phoneCode} ${memberInfo.extraInfos[1].phoneNumber}` }}</li> -->

                    <li>電子信箱：{{ memberInfo.email }}</li>
                    <li>LINE ID：{{ memberInfo.lineId }}</li>
                    <li
                      >標籤：
                      <el-tag v-for="tag in memberInfo.tags" :key="`tag-${tag.id}`" :type="'info'" effect="plain" disable-transitions>
                        {{ tag.title }}
                      </el-tag>
                    </li>
                    <li style="display: flex">內部備註： <span v-html="memberInfo.merchantNote || '目前尚無備註'"></span></li>
                    <template v-if="$hasHomeService()">
                      <li>
                        帳單地址：
                        <template v-if="memberInfo.billingInfo"> {{ memberInfo.billingInfo.city }} {{ memberInfo.billingInfo.district }} {{ memberInfo.billingInfo.address }} </template>

                        <el-button class="is-round" size="mini" @click="enableEditAddress('billing')">
                          <BaseIcon name="edit" />
                          <span>編輯</span>
                        </el-button>
                      </li>
                      <li>
                        地址：
                        <template v-if="memberInfo.shippingInfo"> {{ memberInfo.shippingInfo[0].city }} {{ memberInfo.shippingInfo[0].district }} {{ memberInfo.shippingInfo[0].address }} </template>
                        <el-button class="is-round" size="mini" @click="enableEditAddress('shipping')">
                          <BaseIcon name="edit" />
                          <span>編輯</span>
                        </el-button>
                      </li>
                    </template>
                  </ul>
                  <el-dialog :title="`編輯${addressMode === 'billing' ? '帳單' : ''}地址`" :visible.sync="visibleDialogAddress" top="0" width="680px" append-to-body @close="handleCloseAddress">
                    <template v-if="$hasHomeService() && submitDataMember[`${addressMode}Info`]">
                      <el-form ref="addressForm" :model="submitDataMember" :rules="addressRules" label-position="top" class="el-form--floating" style="margin-top: 30px">
                        <el-row :gutter="10">
                          <el-col :span="12">
                            <el-form-item label="姓名">
                              <el-input v-if="addressMode === 'shipping'" v-model="submitDataMember[`${addressMode}Info`][0].name"></el-input>
                              <el-input v-else v-model="submitDataMember[`${addressMode}Info`].name"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item v-if="addressMode === 'shipping'" label="電話" prop="shippingInfo.0.phone">
                              <el-input v-model="submitDataMember[`${addressMode}Info`][0].phone"></el-input>
                            </el-form-item>
                            <el-form-item v-else label="電話" prop="billingInfo.phone">
                              <el-input v-model="submitDataMember[`${addressMode}Info`].phone"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-form-item v-if="addressMode === 'billing'" label="電子郵件">
                          <el-input v-model="submitDataMember[`${addressMode}Info`].email"></el-input>
                        </el-form-item>
                        <el-row :gutter="10">
                          <el-col :span="12">
                            <el-form-item label="縣市">
                              <el-select v-if="addressMode === 'shipping'" v-model="submitDataMember[`${addressMode}Info`][0].city" placeholder="請選擇縣市" filterable @change="onSelectCity">
                                <el-option v-for="(city, index) in taiwanCitys" :key="`billing-city-${index}`" :label="city.name" :value="city.name"> </el-option>
                              </el-select>
                              <el-select v-else v-model="submitDataMember[`${addressMode}Info`].city" placeholder="請選擇縣市" filterable @change="onSelectCity">
                                <el-option v-for="(city, index) in taiwanCitys" :key="`billing-city-${index}`" :label="city.name" :value="city.name"> </el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="鄉鎮市區">
                              <el-select
                                v-if="addressMode === 'shipping'"
                                v-model="submitDataMember[`${addressMode}Info`][0].district"
                                placeholder="請選擇鄉鎮市區"
                                filterable
                                @change="onSelectDistrict"
                              >
                                <el-option v-for="(district, index) in districts" :key="`billing-district-${index}`" :label="district.name" :value="district.name"> </el-option>
                              </el-select>
                              <el-select v-else v-model="submitDataMember[`${addressMode}Info`].district" placeholder="請選擇鄉鎮市區" filterable @change="onSelectDistrict">
                                <el-option v-for="(district, index) in districts" :key="`billing-district-${index}`" :label="district.name" :value="district.name"> </el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-form-item label="郵政編號">
                          <el-input v-if="addressMode === 'shipping'" v-model="submitDataMember[`${addressMode}Info`][0].postcode"></el-input>
                          <el-input v-else v-model="submitDataMember[`${addressMode}Info`].postcode"></el-input>
                        </el-form-item>
                        <el-form-item label="詳細地址">
                          <el-input v-if="addressMode === 'shipping'" v-model="submitDataMember[`${addressMode}Info`][0].address"></el-input>
                          <el-input v-else v-model="submitDataMember[`${addressMode}Info`].address"></el-input>
                        </el-form-item>
                      </el-form>
                      <div :class="$style.footer">
                        <el-button class="is-round" @click="visibleDialogAddress = false">取消</el-button>
                        <el-button class="is-round" :loading="tryingSaveAddress" :disabled="tryingSaveAddress" type="primary" @click="onSaveAddress">儲存</el-button>
                      </div>
                    </template>
                  </el-dialog>

                  <template v-if="storeInvoiceSetting">
                    <!-- 這裡一定要記得回來改 -->
                    <div class="bottom-line-box-normal"></div>
                    <h4 class="form-block-title"
                      >發票資訊
                      <template v-if="editInvoiceEnabled">
                        <el-button class="is-round" size="mini" @click="cancelEditInvoice">取消</el-button>
                        <el-button class="is-round" size="mini" type="primary" @click="tryToSaveDetail">
                          <BaseIcon name="check" />
                          <span>儲存</span>
                        </el-button>
                      </template>
                      <el-button v-else class="is-round" size="mini" @click="enableEditInvoice">
                        <BaseIcon name="edit" />
                        <span>編輯</span>
                      </el-button>
                    </h4>
                    <ul :class="$style.detail">
                      <template v-if="editInvoiceEnabled">
                        <el-form
                          ref="form-invoice"
                          class="el-form-item--normal-margin el-form-item--white-bg"
                          :model="submitDataMember"
                          :class="$style['detail-form']"
                          label-position="left"
                          label-width="100px"
                        >
                          <InvoiceForm :default-value="submitDataMember" :show-sync="false" />
                        </el-form>
                      </template>
                      <template v-else>
                        <li>開立類型：{{ taxTypeMap[submitDataMember.taxType] }}</li>
                        <template v-if="submitDataMember.taxType === 'B2C'">
                          <li>載具類別：{{ carrierTypeMap[submitDataMember.CarrierType] || '無（寄送電子發票至客戶 email）' }}</li>
                          <li v-if="submitDataMember.CarrierType === '0' || submitDataMember.CarrierType === '1'">載具編號：{{ submitDataMember.CarrierNum }}</li>
                        </template>
                        <li v-else-if="submitDataMember.taxType === 'B2B'">統一編號：{{ submitDataMember.taxId }}</li>
                        <li v-else>捐贈碼：{{ submitDataMember.LoveCode }}</li>
                      </template>
                    </ul>
                  </template>
                </div>
                <div v-if="activeMemberData === 'orders'">
                  <div class="btn-group-inline" style="margin-bottom: 20px">
                    <el-button class="is-round isInputGroup" :class="{ isActive: memberOrderType === 'order' }" @click="onSelectMemberOrderType('order')">預約訂單</el-button>
                    <el-button class="is-round isInputGroup" :class="{ isActive: memberOrderType === 'prepaid-order' }" @click="onSelectMemberOrderType('prepaid-order')">包月方案</el-button>
                  </div>
                  <MemberOrdersProduct v-if="memberOrderType === 'order'" :member-info-id="memberInfo.id" />
                  <MemberOrdersPrepaid v-if="memberOrderType === 'prepaid-order'" :member-info-id="memberInfo.id" />
                </div>
              </div>
            </template>
          </template>
          <!-- 寵物資訊 -->
          <template v-if="petShow">
            <div class="orderformSection__right__header">
              <button class="el-drawer__close-btn" aria-label="close drawer" type="button" @click="closePet"><i class="el-dialog__close el-icon el-icon-close"></i></button>
              <h4 class="orderformSection__right__title">選擇寵物</h4>
            </div>
            <div class="orderformSection__right__content">
              <!-- 寵物form -->
              <template v-if="editPetEnabled">
                <el-button class="is-round is-fullwidth" style="margin-bottom: 20px" @click="closeEditPet">取消編輯</el-button>
                <el-form
                  ref="petForm"
                  :model="submitDataPet"
                  :rules="submitPetRules"
                  label-position="left"
                  class="el-form-item--normal-margin el-form-item--white-bg"
                  :validate-on-rule-change="false"
                  label-width="100px"
                >
                  <el-form-item class="isAvatar">
                    <h6 class="text-cener">{{ petEditMode === 'new' ? '新增寵物資料' : '編輯寵物資料' }}</h6>
                    <BaseUpload v-model="submitDataPet.avatar" v-loading="tryingGetPet" resource="pet" circle dir="pet" />
                  </el-form-item>
                  <el-form-item prop="name" label="寵物名" class="el-form-item--normal-margin">
                    <el-input v-model="submitDataPet.name" placeholder="請輸入寵物名"></el-input>
                  </el-form-item>
                  <el-form-item label="類別" prop="categoryId" class="el-form-item--normal-margin">
                    <el-select v-model="submitDataPet.categoryId" @change="changeCategory">
                      <el-option v-for="(item, index) in category" :key="index" :value="item.id" :label="item.title"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="體型" prop="sizeId" class="el-form-item--normal-margin">
                    <el-select v-model="submitDataPet.sizeId">
                      <el-option v-for="(item, index) in category[parentCategoryIndex].children" :key="index" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="breed" label="品種" class="el-form-item--normal-margin">
                    <el-input v-model="submitDataPet.breed" placeholder="請輸入品種"></el-input>
                  </el-form-item>
                  <el-form-item label="性別" class="el-form-item--normal-margin">
                    <el-select v-model="submitDataPet.gender">
                      <el-option label="母" value="female"></el-option>
                      <el-option label="公" value="male"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="生日" class="el-form-item--normal-margin">
                    <el-date-picker v-model="submitDataPet.birthday" type="date" value-format="yyyy-MM-dd"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="個性" class="el-form-item--normal-margin">
                    <el-checkbox-group v-model="submitDataPet.questions.personality">
                      <el-checkbox v-for="item in questions.personality" :key="item.name" :label="item.title">{{ item.title }}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="健康狀況" class="el-form-item--normal-margin">
                    <el-checkbox-group v-model="healthy">
                      <template v-for="item in questions.healthy">
                        <el-checkbox :key="item.name" :label="item.title">{{ item.title }}</el-checkbox>
                        <!-- <el-checkbox  :label='item.title'>{{item.title}} </el-checkbox> -->
                        <el-input v-if="healthy.includes('其他疾病') && item.name === 'other'" :key="item.title" v-model="item.text" placeholder="請填寫其他疾病" />
                      </template>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="行為" class="el-form-item--normal-margin">
                    <el-checkbox-group v-model="behavior">
                      <template v-for="item in questions.behavior">
                        <div :key="item.title" class="inline-checkbox-input">
                          <el-checkbox :key="item.name" :label="item.title">{{ item.title }}</el-checkbox>
                          <el-input v-model="item.text" />
                        </div>
                      </template>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="疫苗" class="el-form-item--normal-margin no-bg-radio-group">
                    <el-radio v-model="submitDataPet.questions.vaccine" :label="1">1 劑</el-radio>
                    <el-radio v-model="submitDataPet.questions.vaccine" :label="2">2 劑</el-radio>
                    <el-radio v-model="submitDataPet.questions.vaccine" :label="3">3 劑</el-radio>
                  </el-form-item>
                  <p>內部備註</p>
                  <el-form-item label="" label-width="0">
                    <el-input v-model="submitDataPet.note" type="textarea" :rows="2"></el-input>
                    <!-- <BaseInputFloatingLabel v-model="pet.remark" type="textarea" :autosize="{ minRows: 2 }" /> -->
                  </el-form-item>
                  <div class="btn-group-inline" style="padding: 30px 0 50px">
                    <el-button plain class="is-round" @click="closeEditPet">取消</el-button>
                    <el-button :loading="tryingSaveMember" class="is-round" type="primary" @click="tryToSavePet">儲存</el-button>
                  </div>
                </el-form>
              </template>
              <template v-else>
                <template v-if="!showDetailPet">
                  <!-- 寵物list -->
                  <el-button class="is-round is-fullwidth" type="primary" style="margin-bottom: 20px" @click="creatPet">新增</el-button>
                  <div v-for="item in petList" :key="item.id" :class="[$style.petList, { isActive: submitData.petId === item.id }]" @click="selectPet(item)">
                    <img v-if="item.avatar" class="petList__img" :src="item.avatar" alt="" />
                    <img v-else class="petList__img" src="@assets/images/staff_avatar_haku.png" alt="" />
                    <div class="petList__cont">
                      <div style="padding-bottom: 10px">{{ item.name }}</div>
                      {{ item.breed }}
                      {{ item.categoryTitle }}
                      {{ item.sizeTitle }}
                    </div>
                    <el-button class="petList__btn" type="text" @click.stop="gotoSinglePet(item)">
                      <BaseIcon name="eye" />
                    </el-button>
                  </div>

                  <!-- <div class="el-table-wrapper">
                  <el-table :data="petList" element-loading-text="取得寵物資訊中" @row-click="gotoSinglePet">
                    <el-table-column v-slot="{ row }" label="寵物頭像" :min-width="12">
                      <div :class="$style.petListImg">
                        <img :src="row.avatar" alt="" />
                      </div>
                    </el-table-column>
                    <el-table-column prop="name" label="寵物名字" :min-width="12"> </el-table-column>
                    <el-table-column prop="categoryTitle" label="種類" :min-width="8"> </el-table-column>
                    <el-table-column prop="sizeTitle" label="體型" :min-width="12"> </el-table-column>

                    <el-table-column v-slot="{ row }" width="80">
                      <el-tooltip content="刪除" placement="top">
                        <el-button class="is-round" type="danger" plain size="mini" @click.stop="tryToRemovePet(row.id)">
                          <BaseIcon name="trash-alt" />
                        </el-button>
                      </el-tooltip>
                      <el-tooltip content="查看寵物資訊" placement="top">
                        <el-button type="text">
                          <BaseIcon name="ellipsis-v" />
                        </el-button>
                      </el-tooltip>
                    </el-table-column>
                  </el-table>
                </div> -->
                </template>

                <template v-else>
                  <!-- 寵物詳細資料 -->
                  <template>
                    <el-button class="is-round is-fullwidth" style="margin-bottom: 20px" @click="backToPetList">返回寵物列表</el-button>
                    <!-- <div class="pet__back" style="margin-bottom: 20px" @click="backToPetList"><i class="el-icon-back"></i> 返回寵物列表</div> -->
                    <div class="btn-group-inline" style="margin-bottom: 20px">
                      <el-button class="is-round isInputGroup" :class="{ isActive: petTabType === 'info' }" @click="onSelectPetTabType('info')">寵物資訊</el-button>
                      <el-button class="is-round isInputGroup" :class="{ isActive: petTabType === 'comment' }" @click="onSelectPetTabType('comment')">寵物備註</el-button>
                    </div>
                    <div v-if="petTabType === 'info'" :class="$style.pet">
                      <div v-loading="tryingGetPet" class="pet__box" element-loading-background="rgba(0, 0, 0, 0)">
                        <el-row :gutter="20" style="margin-bottom: 30px">
                          <el-col :span="24">
                            <div class="pet__avatar" style="margin-bottom: 20px">
                              <BaseUpload v-model="singlePetData.avatar" resource="pet" circle dir="pet" @sendSuccess="petUploadToStore" />
                            </div>
                          </el-col>
                          <el-col :span="24">
                            <div class="top">
                              <el-button size="mini" class="is-round" :disabled="tryingGetPet" @click="openEditPet">
                                <BaseIcon name="edit" />
                                <span>編輯</span>
                              </el-button>
                            </div>
                          </el-col>
                          <el-col :span="24">
                            <div class="pet__info">
                              <ul class="pet__info__list">
                                <li class="pet__info__item">寵物名<span class="danger">*</span>：{{ singlePetData.name }}</li>
                                <li class="pet__info__item">類別<span class="danger">*</span>：{{ singlePetData.categoryTitle }}</li>
                                <li class="pet__info__item">體型<span class="danger">*</span>：{{ singlePetData.sizeTitle }}</li>
                                <li class="pet__info__item">品種：{{ singlePetData.breed }}</li>
                                <li class="pet__info__item">
                                  性別：
                                  <span v-if="singlePetData.gender">
                                    {{ singlePetData.gender === 'male' ? '公' : '母' }}
                                  </span>
                                </li>
                                <li class="pet__info__item">生日：{{ singlePetData.birthday }}</li>
                              </ul>
                            </div>
                          </el-col>
                        </el-row>
                        <div class="notice">
                          <h4 class="form-block-title">寵物問題：</h4>

                          <ul v-if="singlePetData.questions" class="pet__info__list">
                            <li class="pet__info__item">個性：{{ personalityContent ? personalityContent : '未填寫' }}</li>
                            <li class="pet__info__item">健康狀況：{{ healthyContent ? healthyContent : '未填寫' }}</li>
                            <li class="pet__info__item indentList">
                              <span class="title">行為：</span>
                              <template v-if="behaviorContent.length > 0">
                                <span class="content">
                                  <span v-for="n in behaviorContent" :key="n" class="content__item">{{ n }}</span>
                                </span>
                              </template>
                              <span v-else>未填寫</span>
                            </li>
                            <li class="pet__info__item">疫苗：{{ singlePetData.questions.vaccine ? vaccineContent : '未填寫' }}</li>
                          </ul>
                        </div>
                        <div class="notice">
                          <h4 class="form-block-title">內部備註：</h4>

                          <div> {{ singlePetData.note }}</div>
                        </div>
                      </div>
                    </div>
                    <PetCommentList v-if="singlePetData.id && petTabType === 'comment'" ref="commentAll" :order="undefined" :pet="singlePetData.id" type="pet" />
                  </template>
                </template>
              </template>
            </div>
          </template>
          <!-- 服務選擇 -->
          <template v-if="serviceShow">
            <div class="orderformSection__right__header">
              <button class="el-drawer__close-btn" aria-label="close drawer" type="button" @click="closeService"><i class="el-dialog__close el-icon el-icon-close"></i></button>
              <h4 class="orderformSection__right__title">選擇服務</h4>
            </div>
            <div class="orderformSection__right__content">
              <template v-if="submitData.petId">
                <template v-if="filteredServices.length > 0">
                  <div v-for="item in filteredServices" :key="item.id" :class="$style.price">
                    <el-image class="image price__image" :src="item.image" fit="cover">
                      <div slot="error">
                        <BaseIcon name="image" class="image--error" />
                      </div>
                    </el-image>
                    <div class="price__cont">
                      <div>
                        <div class="price__title">
                          <span v-if="multipleStore">{{ item.storeTitle }}</span> {{ item.title }}
                        </div>
                        <div class="text-muted-0"> ${{ item.price }} </div>
                      </div>
                      <el-button class="is-round is-fullwidth" :class="{ isActive: item.id === submitData.params[0].priceId }" @click="selectService(item)">選擇服務</el-button>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <el-alert   title="目前選擇的寵物與不在服務人員的排班範圍之內" type="warning" :closable="false"></el-alert>
                </template>
              </template>
              <span v-else>
                請先選擇寵物
              </span>
              
              
            </div>
          </template>
          <!-- 包月選擇 -->
          <template v-if="prepaidShow">
            <div class="orderformSection__right__header">
              <button class="el-drawer__close-btn" aria-label="close drawer" type="button" @click="closePrepaid"><i class="el-dialog__close el-icon el-icon-close"></i></button>
              <h4 class="orderformSection__right__title">
                <div class="inline-between" style="padding-right: 15px; align-items: center">
                  可使用包月方案
                  <el-button type="text" style="padding-top: 0; padding-bottom: 0; text-decoration: underline" @click="goToBuyPrepaid"> 購買包月方案 </el-button>
                </div>
              </h4>
            </div>
            <div class="orderformSection__right__content">
              <!-- {{filteredAvailablePrepaidList}} -->
              <template v-if="filteredAvailablePrepaidList.length > 0">
                <div v-for="item in filteredAvailablePrepaidList" :key="item.id" :class="[$style.price,{ isDisabled: item.status !== 1 }]" style="cursor: pointer" @click="goToPrepaid(item)">
                  <el-image class="image price__image" :src="item.image" fit="cover">
                    <div slot="error">
                      <BaseIcon name="image" class="image--error" />
                    </div>
                  </el-image>
                  <div class="price__cont">
                    <div>
                      <div class="price__title">
                        <div v-if="multipleStore" style="padding-bottom: 5px">{{ item.storeTitles.join('，') }} </div> {{ item.prepaidTitle }}
                      </div>
                      <div class="text-muted-0" style="line-height: 1.6">
                        可抵用次數：{{ item.times - item.used }}/{{ item.times }}<br />
                        到期日：{{ item.expiredDate ? item.expiredDate : '' | formatDate }}{{ item.expiredDate ? '' : '無使用期限' }}
                        <div v-if="item.status === 2" class="alert-text"> 未付款</div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <el-alert v-else title="目前選擇的寵物與服務人員無適用之包月方案，請調整購買數量、建議顧客購買新的包月方案" type="warning" :closable="false"></el-alert>
              <!-- <span v-else>請先選擇寵物</span> -->
            </div>
          </template>
          <!-- 編輯到府地址 -->
          <template v-if="addressShow">
            <div class="orderformSection__right__header">
              <button class="el-drawer__close-btn" aria-label="close drawer" type="button" @click="closeAddress"><i class="el-dialog__close el-icon el-icon-close"></i></button>
              <h4 class="orderformSection__right__title">編輯到府地址</h4>
            </div>
            <div class="orderformSection__right__content">
              <div >
                 <el-form ref="addressForm" class="el-form-item--white-bg" :rules="submitRules" :model="submitData">
                      <el-row :gutter="20">
                        <el-col :md="12">
                          <el-form-item prop="city" label="縣市">
                            <el-select v-model="submitData.city" filterable placeholder="請選擇" @change="onSelectCity">
                              <el-option v-for="(city, index) in isEditMode ? editFilterCities : filterCities" :key="index" :label="city.city" :value="city.city"> </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :md="12">
                          <el-form-item prop="district" label="區域">
                            <el-select v-model="submitData.district" placeholder="請選擇" filterable>
                              <el-option v-for="(district, index) in districts" :key="index" :label="district" :value="district"> </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :md="24">
                          <el-form-item prop="address" label="地址">
                            <el-input v-model="submitData.address" placeholder="地址" />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-checkbox v-if="!isEditMode" v-model="enableSaveAddress" style="margin-bottom: 20px">儲存到客戶地址</el-checkbox>
                    </el-form>
           
                <div class="btn-group-inline" style="padding: 30px 0 50px">
                  <el-button plain class="is-round" @click="closeAddress">取消</el-button>
                  <el-button :loading="tryingStore" :disabled="tryingStore" class="is-round" type="primary" @click="saveHomeAddress">儲存</el-button>
                </div>
              </div>
              <!-- <el-button class="is-round is-fullwidth" type="primary" :loading="tryingStore" @click="tryToSaveOrder"> 儲存 </el-button> -->
            </div>
          </template>

          <!-- 退款 -->
          <template v-if="orderRefundShow">
            <div class="orderformSection__right__header">
              <button class="el-drawer__close-btn" aria-label="close drawer" type="button" @click="closeOpenRefund"><i class="el-dialog__close el-icon el-icon-close"></i></button>
              <h4 class="orderformSection__right__title">訂單退款</h4>
            </div>
            <div class="orderformSection__right__content">
              <div >
                <el-form ref="refundForm" :rules="refundRules" :model="refundSubmitData" class="el-form--floating el-form-item--white-bg" label-position="top">
                  <el-form-item label="退款金額" prop="amount" >
                    <el-input v-model="refundSubmitData.amount" :disabled="!canPartialRefund" placeholder=""><span slot="suffix" style="padding-right: 10px">元</span></el-input>
                    <span class="alert-word">上限為{{ currentOrder.backBalance }}元</span>
                  </el-form-item>
                  <el-form-item label="退款日期" prop="refundDate">
                    <el-date-picker v-model="refundSubmitData.refundDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="選擇日期"> </el-date-picker>
                  </el-form-item>
                  <el-form-item label="退款原因" style="margin-bottom: 20px">
                    <el-input v-model="refundSubmitData.note" type="textarea" :autosize="{ minRows: 2 }" placeholder=""></el-input>
                    <p>除「信用卡」付款之外，其他所有支付方式若需退款服務，皆須透過店家進行線下退款。</p>
                  </el-form-item>
                </el-form>

                <div class="bottom-btn-center">
                  <el-button class="is-round" @click="closeOpenRefund">取消</el-button>
                  <el-button class="is-round" type="primary" @click="tryToRefund(currentOrder.id)">確認退款記錄</el-button>
                </div>
              </div>
                
            </div>
          </template>
         
          <!-- 備註編輯 -->
          <template v-if="noteEditShow">
            <div class="orderformSection__right__header">
              <button class="el-drawer__close-btn" aria-label="close drawer" type="button" @click="closeNoteEdit"><i class="el-dialog__close el-icon el-icon-close"></i></button>
              <h4 class="orderformSection__right__title">編輯備註</h4>
            </div>
            <div class="orderformSection__right__content">
              <el-form ref="form" :model="currentOrder" :rules="submitRules" label-position="top" class="el-form-item--normal-margin el-form-item--white-bg">
                <div style="display: flex; margin-bottom: 10px"> <h6 style="margin-top: 0">使用人</h6> <el-checkbox v-model="userSameAsMember" class="check-by-head">使用人同客戶</el-checkbox> </div>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item prop="fullName" class="el-form-item--white-bg-border" label="姓名">
                      <el-input v-model="currentOrder.fullName" :disabled="userSameAsMember" placeholder="姓名"> </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item class="gender-box" prop="gender">
                      <el-radio-group v-model="currentOrder.gender" class="no-bg-radio-group">
                        <el-radio label="male">先生</el-radio>
                        <el-radio label="female">小姐</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item prop="phoneNumber" class="el-form-item--white-bg-border" label="電話">
                      <el-input v-model="currentOrder.phoneNumber" :disabled="userSameAsMember" placeholder="手機號碼" autocomplete="tel">
                        <CountryCodePicker slot="prepend" v-model="currentOrder.phoneCode" :disabled="userSameAsMember" />
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-form class="el-form-item--normal-margin el-form-item--white-bg el-form--label-top">
                <OrderExtraField ref="extrafieldEdit" :default-value="defaultValue" />
                <el-form-item label="使用人備註">
                  <small style="display: block; opacity: 0.5; line-height: 1.3; margin-bottom: 10px">客戶可瀏覽此備註。若是不需要提供客戶瀏覽的資訊，請使用「內部備註」功能</small>
                  <el-input v-model="currentOrder.note" type="textarea" :rows="2"></el-input>
                </el-form-item>
              </el-form>
              <el-button class="is-round is-fullwidth" type="primary" :loading="tryingStore" @click="tryToSaveOrder('extraField')"> 儲存 </el-button>
            </div>
          </template>
          <!-- 查看歷史紀錄 -->
          <template v-if="orderHistoryShow">
            <div class="orderformSection__right__header">
              <button class="el-drawer__close-btn" aria-label="close drawer" type="button" @click="closeHistory"><i class="el-dialog__close el-icon el-icon-close"></i></button>
              <h4 class="orderformSection__right__title">訂單變更記錄</h4>
            </div>
            <div class="orderformSection__right__content">
              <el-timeline>
                <el-timeline-item v-for="log in currentHistory" :key="log.id" :timestamp="log.created | formatDate('dateTime')" type="primary" placement="top">
                  {{ log.description }}
                  <span style="font-size: 13px">
                    <span v-if="log.creator">- {{ log.creator }}</span>
                  </span>
                  <div v-if="log.note">{{ log.note }}</div>
                </el-timeline-item>
              </el-timeline>
              <!-- <el-button class="is-round is-fullwidth" type="primary" :loading="tryingStore" @click="tryToSaveOrder"> 儲存 </el-button> -->
            </div>
          </template>

          <!-- 編輯付款方式 -->
          <template v-if="editPaymentMethodShow">
            <div class="orderformSection__right__header">
              <button class="el-drawer__close-btn" aria-label="close drawer" type="button" @click="closeEditPaymentMethod"><i class="el-dialog__close el-icon el-icon-close"></i></button>
              <h4 class="orderformSection__right__title">編輯付款方式</h4>
            </div>
            <div class="orderformSection__right__content">
              <div class="payment-radio" style="">
                <div style="display: flex; margin-bottom: 10px">
                  <h6>付款方式</h6><el-checkbox v-model="currentOrder.allowExpired" class="check-by-head text-muted-0" :false-label="0" :true-label="1">可逾期付款</el-checkbox>
                </div>
                <el-radio-group v-model="currentOrder.paymentMethod">
                  <!-- <el-radio v-if="currentOrder.paymentStatus === 'UNPAID'" :label="null" border>不指定</el-radio> -->
                  <el-radio label="Cash" border>到店付款(現金)</el-radio>
                  <el-radio label="StoreCredit" border>現場刷卡</el-radio>
                  <el-radio label="Atm" border>線下匯款</el-radio>
                  <el-radio v-if="currentOrder.paymentStatus === 'UNPAID' && storeCashflowSetting === 1" label="Credit" border>信用卡付款</el-radio>
                  <el-radio v-if="currentOrder.paymentStatus === 'UNPAID' && storeCashflowSetting !== 0" label="Vacc" border>ATM虛擬帳戶</el-radio>

                  <!-- <el-radio v-if="prepaidListAfterService.length > 0 && !isBuyPrepaid && !isPrepaidAndEdit" label="Prepaid" border>包月抵扣</el-radio>
                  <el-radio label="offline" :disabled="ordertype === 'prepaid-order' && !isBuyPrepaid && !isPrepaidAndEdit" border>線下付款</el-radio>
                  <el-radio label="online" :disabled="ordertype === 'prepaid-order' && !isBuyPrepaid && !isPrepaidAndEdit" border>線上付款</el-radio> -->
                </el-radio-group>
                <template v-if="currentOrder.paymentMethod === 'StoreCredit'">
                  <div class="" style="margin-bottom: 15px; padding-top: 10px">信用卡末四碼</div>
                  <div class="el-form-item el-form-item--white-bg-border">
                    <template>
                      <el-input v-model="currentOrder.Card4No" placeholder="請輸入"> </el-input>
                    </template>
                  </div>
                  <!-- <el-button type="primary" class="is-round is-fullwidth" @click="goToExtrafields(true)"> 確認 </el-button>
                    <el-button class="is-round is-fullwidth" @click="goToExtrafields(false)"> 稍後付款 </el-button> -->
                </template>
                <template v-if="currentOrder.paymentMethod === 'Atm'">
                  <div class="" style="margin-bottom: 15px; padding-top: 10px">匯款帳號末五碼</div>
                  <div class="el-form-item el-form-item--white-bg-border">
                    <template>
                      <el-input v-model="currentOrder.PayerAccount5Code" placeholder="請輸入"> </el-input>
                    </template>
                  </div>
                  <!-- <el-button type="primary" class="is-round is-fullwidth" @click="goToExtrafields(true)"> 確認 </el-button>
                    <el-button class="is-round is-fullwidth" @click="goToExtrafields(false)"> 稍後付款 </el-button> -->
                </template>
                <template v-if="currentOrder.paymentMethod === 'Vacc'">
                  <el-form ref="bankType" :model="currentOrder" :rules="submitRules">
                    <el-form-item prop="bankType" class="el-form-item--white-bg-border" label="轉帳銀行">
                      <template>
                        <el-select v-model="currentOrder.bankType">
                          <el-option v-for="(bank, index) in bankTypeList" :key="`bank-${index}`" :value="bank.id" :label="bank.title"></el-option>
                        </el-select>
                      </template>
                    </el-form-item>
                  </el-form>

                  <!-- <el-button type="primary" class="is-round is-fullwidth" @click="goToExtrafields(false)"> 確認 </el-button> -->
                  <!-- <el-button class="is-round is-fullwidth"> 稍後付款 </el-button> -->
                </template>
                <div class="btn-group-inline" style="padding: 30px 0 50px">
                  <el-button plain class="is-round" @click="closeEditPaymentMethod">取消</el-button>
                  <el-button :loading="tryingStore" :disabled="tryingStore" class="is-round" type="primary" @click="tryToStorePayment">確認變更</el-button>
                </div>
              </div>
              <!-- <el-button class="is-round is-fullwidth" type="primary" :loading="tryingStore" @click="tryToSaveOrder"> 儲存 </el-button> -->
            </div>
          </template>
        </template>
        <!-- 變價 -->
        <template>
          <div v-if="isEditMode" :class="$style.total">
            <div class="total__cont">
              <TotalTable
                is-out-side
                :is-edit-mode="isEditMode"
                :is-paid="isPaid"
                :has-coupon-info="hasCouponInfo"
                :order-params.sync="submitData.params"
                :order-total-edit-list.sync="totalEditList"
                :order-add-list.sync="addList"
                :service-total="serviceTotal"
                :coupon-price-total="couponPriceTotal"
                :submit-price-total="submitPriceTotal"
                :coupon-info="couponInfo"
                :submit-data="submitData"
                :submit-data-prepaid="submitDataPrepaid"
                :current-buy-prepaid="currentBuyPrepaid"
                @openAdd="openAddEdit"
                @editOpenTotalEdit="editOpenTotalEdit"
                @editOpenPaymentMethod="editOpenPaymentMethod"
                @editOpenHistory="editOpenHistory"
                @tryToCancelOrder="tryToCancelOrder"
                @editOpenRefund="editOpenRefund"
              >
                <div style="padding: 30px">
                  <el-button v-if="defaultValue.status !== 0" class="is-round is-fullwidth" @click="openAddOrder">新增子訂單</el-button>
                </div>
                <!-- <div v-if="submitData.params[0].priceId" class="btn-group-inline" :class="$style.bottom" style="padding: 30px">
                  <el-button plain class="is-round" @click="openTotalEdit">價格編輯與折扣</el-button>
                  <el-button class="is-round" @click="openAddEdit">加購</el-button>
                </div> -->
              </TotalTable>
            </div>
          </div>
          <div v-else :class="$style.total">
            <div class="total__cont">
              <TotalTable
                is-out-side
                :is-edit-mode="isEditMode"
                :has-coupon-info="hasCouponInfo"
                :order-params.sync="submitData.params"
                :order-total-edit-list.sync="totalEditList"
                :order-add-list.sync="addList"
                :service-total="serviceTotal"
                :coupon-price-total="couponPriceTotal"
                :submit-price-total="submitPriceTotal"
                :coupon-info="couponInfo"
                :submit-data="submitData"
                :submit-data-prepaid="submitDataPrepaid"
                :current-buy-prepaid="currentBuyPrepaid"
                @openAdd="openAddEdit"
              >
                <div v-if="submitData.params[0].priceId" class="btn-group-inline" :class="$style.bottom" style="padding: 30px">
                  <el-button plain class="is-round" @click="openTotalEdit">價格編輯與折扣</el-button>
                  <el-button class="is-round" @click="openAddEdit">加購</el-button>
                </div>
              </TotalTable>
            </div>
            <div class="total__bottom">
              <div style="display: flex; margin-bottom: 10px">
                <h6>付款方式</h6><el-checkbox v-model="submitData.allowExpired" class="check-by-head text-muted-0" :false-label="0" :true-label="1">可逾期付款</el-checkbox>
              </div>
              <el-radio-group v-model="paymentWay">
                <el-radio v-if="prepaidListAfterService.length > 0 && !isBuyPrepaid && !isPrepaidAndEdit && ordertype === 'prepaid-order'" label="Prepaid" border>包月抵扣</el-radio>
                <el-radio label="offline" :disabled="ordertype === 'prepaid-order' && !isBuyPrepaid && !isPrepaidAndEdit" border>線下付款</el-radio>
                <el-radio label="online" :disabled="ordertype === 'prepaid-order' && !isBuyPrepaid && !isPrepaidAndEdit" border>線上付款</el-radio>
              </el-radio-group>
            </div>
          </div>
        </template>
      </div>

      <!-- 底部按鈕 -->
      <div class="orderformSection__bottom">
        <div v-if="isEditMode" style="display: flex; align-items: center">
          <BaseStateLabel :state="defaultValue.paymentStatus | paymentStatusMapFilter('color')">{{ defaultValue.paymentStatus | paymentStatusMapFilter('text') }}</BaseStateLabel>
          <BaseStateLabel :round="true" style="padding: 0 18px; height: 25px" :state="defaultValue.status | bookingStatusFilter('color')" text>{{
            defaultValue.status | bookingStatusFilter('text')
          }}</BaseStateLabel>
          <div style="padding-left: 20px">
            <!-- <span v-if="!isPaid">應付</span>  -->
            NT$ {{ defaultValue.allActualPayTotal }} 
            <span v-if="defaultValue.allUnpaidTotal" style="color:#e35d5d;margin-left:5px;font-size:12px;display:inline-block"> ( 未付款金額 NT${{defaultValue.allUnpaidTotal}} )</span> <br /><BaseStateLabel class="text-muted-0" style="padding-top: 5px" state="info" text>{{
              defaultValue.paymentMethod | orderPaymentMethodFilter
            }}</BaseStateLabel>
          </div>
        </div>

        <div v-else style="display: flex; align-items: center">
          <BaseStateLabel :state="defaultValue.paymentStatus | paymentStatusMapFilter('color')">{{ defaultValue.paymentStatus | paymentStatusMapFilter('text') }}</BaseStateLabel>
          <div style="padding-left: 20px">
            應付 NT$ <span v-if="submitDataPrepaid.prepaidId"> {{ currentBuyPrepaid.price }} + </span> {{ submitPriceTotal }}
            <!-- <span v-if="currentService">{{currentService.price}}</span><span v-else>0</span> -->
            <div v-if="!submitData.params[0].priceId" class="text-muted-0" style="padding-top: 5px">未選擇付款方式</div>
          </div>
        </div>

        <div v-if="isEditMode" style="flex-shrink:0;padding:0 10px">
          <el-button type="text" class="no-color-text-btn" style="font-size: 20px; margin-right: 5px" @click="writeDialogVisible = true"
            ><BaseIcon name="envelope" :icon-style="'fal'"></BaseIcon
          ></el-button>
          <el-button v-if="defaultValue.status !== 5 && defaultValue.status !== 0" style="font-size: 20px" type="text" class="icon-text no-color-text-btn" @click="showShareDialog"
            ><BaseIcon name="paper-plane" :icon-style="'fal'"></BaseIcon
          ></el-button>
        </div>

        <!-- 撰寫通知 -->
        <BaseButtonDialog :only-dialog="true" :title="'撰寫通知'" :dialog-visible.sync="writeDialogVisible" :destroy="true" floating>
          <NotificationWrite :selected-order-ids="[defaultValue.id]" :source-name="'order'" :source-order="defaultValue" @close="closeNotificationDialog" />
        </BaseButtonDialog>

        <!-- 分享連結 -->
        <el-dialog title="分享連結" :visible.sync="shareDialogVisible" top="0" width="680px" append-to-body lock-scroll @open="tryToGetShareLink">
          <div slot="title">
            <h5>{{ `#${defaultValue.id}` }}</h5>
            <ul>
              <li>使用人：{{ defaultValue.fullName }} {{ defaultValue.gender | genderFilter }}</li>
              <li>訂購內容：{{ defaultValue.productName }} {{ defaultValue.date | formatDate }} {{ defaultValue.time }}</li>
            </ul>
          </div>

          <div :class="$style['share__buttons']">
            <el-button type="text" :class="$style['share__button']" @click="handleShareLink('facebook')">
              <BaseIcon :class="$style['share__icon']" name="facebook-f" icon-style="fab" />
            </el-button>

            <el-button type="text" :class="$style['share__button']" @click="handleShareLink('line')">
              <BaseIcon :class="$style['share__icon']" name="line" icon-style="fab" />
            </el-button>
            <el-button type="text" :loading="tryingSendSMS" :class="$style['share__button']" @click="tryToSendSMS">
              <BaseIcon :class="$style['share__icon']" name="sms" />
            </el-button>
            <div :class="$style['share__button']">
              <el-button circle @click="copyShareLink">
                <BaseIcon name="copy" />
              </el-button>
              <div :class="$style['share__label']">複製連結</div>
            </div>
          </div>
        </el-dialog>

        <template v-if="isEditMode">
          <div style="flex-shrink:0">
            <el-button v-if="defaultValue.status === 3" class="is-round orderformSection__bottom__btn-item" type="primary" :disabled="tryingStore" :loading="tryingStore" @click="changeCheckDialog"
              >變更報到狀態</el-button
            >
            <el-button
              v-if="
                defaultValue.status !== 0 &&
                defaultValue.paymentStatus === 'UNPAID' &&
                defaultValue.paymentMethod !== 'Credit' &&
                defaultValue.paymentMethod !== 'Vacc' &&
                defaultValue.paymentMethod !== 'Prepaid' 
              "
              class="is-round orderformSection__bottom__btn-item"
              type="success"
              :disabled="tryingStore"
              :loading="tryingStore"
              @click="openPaidDialog"
              >付款</el-button
            >
            <el-button
              v-if="unPaidAddOrder && unPaidAddOrder.id &&
              unPaidAddOrder.paymentStatus === 'UNPAID' &&
              unPaidAddOrder.paymentMethod !== 'Credit' &&
              unPaidAddOrder.paymentMethod !== 'Vacc' 
              "
              class="is-round orderformSection__bottom__btn-item"
              type="success"
              :disabled="tryingStore"
              :loading="tryingStore"
              @click="openAddPaidDialog"
              >付款子訂單</el-button
            >
            <!-- <el-button
              
              class="is-round orderformSection__bottom__btn-item"
              type="success"
              :disabled="tryingStore"
              :loading="tryingStore"
              @click="openPaidDialog"
              >付款子訂單 訂單編號</el-button
            > -->
            <template v-if="defaultValue.prepaidOrderStatus === 2">
              <div style="display:inline-block">
                <el-alert  style="display:inline-block; width:auto;top:14px;left:0;margin-left:10px" type="error" :closable="false">
                  <span slot="title" class="">包月訂單未付款</span>
                  
                  <!-- <el-button class="is-round" size="mini" @click="goToPrepaidOrder(defaultValue.prepaidOrderUuid)">
                    
                    <span>前往</span>
                  </el-button> -->
                </el-alert>
                <el-button type="text" style="padding-top: 0; text-decoration: underline;margin-left:10px" @click="goToPrepaidOrder(defaultValue.prepaidOrderUuid)"> 前往 </el-button>
              </div>
            </template>
            <el-button v-if="defaultValue.status === 4 && isPaid && !unPaidAddOrder && defaultValue.prepaidOrderStatus !== 2" class="is-round orderformSection__bottom__btn-item" type="primary" @click="showSignDialog">簽名請款</el-button>
            <template  v-if="defaultValue.status === 4">
              
              <template >

                <el-alert v-if="!isPaid || unPaidAddOrder" style="display:inline-block; width:auto;top:14px;left:0;margin-left:20px" type="error" :closable="false">
                  <span slot="title">請將訂單及子訂單款項結清，<br>始可完成簽名請款</span>
                </el-alert>
              </template>
            </template>
          </div>
        </template>
        <template v-else>
          <el-button
            v-if="isBuyPrepaid"
            class="is-round orderformSection__bottom__btn"
            type="primary"
            :disabled="tryingStore || !submitData.params[0].priceId"
            :loading="tryingStore"
            @click="handleStorePrepaidOrder"
            >購買包月方案 + 新增預約</el-button
          >
          <el-button v-else class="is-round orderformSection__bottom__btn" type="primary" :disabled="tryingStore || !submitData.params[0].priceId" :loading="tryingStore" @click="handleStoreOrder"
            >新增預約</el-button
          >
        </template>
      </div>

      <!-- 報到與未報到 -->
      <el-dialog :visible.sync="changeDialogVisible" width="40%" top="0" custom-class="small-dialog" :close-on-click-modal="false" append-to-body>
        <div slot="title">
          <div class="circle-icon bg-success">
            <BaseIcon name="check"></BaseIcon>
          </div>
          <h4 style="margin-bottom: 10px">報到狀態</h4>
        </div>
        <el-button type="primary" class="is-round is-fullwidth" @click="openCheckDialog"> 已報到 </el-button>
        <el-button type="primary" class="is-round is-fullwidth" @click="noShowDialogVisible = true"> 未報到 </el-button>
      </el-dialog>

      <!-- 報到 -->

      <el-dialog v-if="defaultValue.scheduleItem" :title="'確認將此訂單改為「已報到」'" :visible.sync="checkDialogVisible" top="0" append-to-body>
        <el-form ref="beauticianForm" :model="check" :rules="helpSubmitRules" class="el-form-item--normal-margin" label-width="100px" label-position="left">
          <el-form-item label="美容師" class="el-form-item--normal-margin">
            {{ defaultValue.scheduleItem ? defaultValue.scheduleItem.name : '' }}
            <!-- <el-select v-model="check.beautician">
            <el-option v-for="item in beauticianList" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select> -->
          </el-form-item>

          <div v-loading="tryingAssign" element-loading-background="rgba(0, 0, 0,0)">
            <el-form-item v-if="assignList.length > 0" label="助理" prop="assistant" class="el-form-item--normal-margin">
              <el-select v-model="check.helperId">
                <el-option label="不指派" value></el-option>
                <el-option v-for="(item, index) in assignList" :key="index" :value="item.id" :label="`${item.name} ${item.sameStore ? '(同分店)' : '(不同分店)'}`"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="assignList.length === 0 && !tryingAssign" label="助理" prop="assistant" class="el-form-item--normal-margin">
              <el-alert title="目前無人員可指派" type="warning" :closable="false"></el-alert>
            </el-form-item>
          </div>
        </el-form>

        <div class="bottom-btn-center">
          <el-button class="is-round" @click="checkDialogVisible = false">取消</el-button>
          <el-button class="is-round" type="primary" @click="tryToStoreAssignAndCheckIn">確認</el-button>
        </div>
      </el-dialog>

      <!-- 未報到 -->

      <el-dialog title="請說明未報到情況" :visible.sync="noShowDialogVisible" top="0" append-to-body>
        <el-form ref="form" :model="submitData" :rules="{ note: [{ required: true, message: '請輸入情況！', trigger: 'blur' }] }">
          <el-form-item prop="note">
            <el-input v-model="submitData.note" type="textarea" class="is-round is-light is-border" :rows="4" placeholder="請輸入備註"></el-input>
          </el-form-item>
        </el-form>
        <el-row :gutter="20" style="margin-top: 20px">
          <el-col :span="12">
            <el-button class="is-round is-fullwidth" @click="noShowDialogVisible = false">返回</el-button>
          </el-col>
          <el-col :span="12">
            <el-button :loading="tryingNoShow" :disabled="tryingNoShow" type="danger" class="is-round is-fullwidth" @click="onClickNoShow">未報到</el-button>
          </el-col>
        </el-row>
      </el-dialog>

      <!-- 新增訂單狀態變更，先不用 -->
      <!-- <OrderChangeStatusDialog :visible.sync="statusDialogVisible" :order="submitData" :prepaid-order="submitDataPrepaid" @paid="handleCreateOrder" @cancelled="emitStore" /> -->
    </div>
    <!-- 簽名請款 -->
    <SignatureDialog :key="signDialogKey" :visible.sync="signDialogVisible" :order="{ ...defaultValue }" @update="updateOrder" />

    <!-- 選擇付款方式和訂單狀態 -->
    <el-dialog :visible.sync="paymentDialogVisible" width="40%" top="0" custom-class="small-dialog" :close-on-click-modal="false" append-to-body>
      <template v-if="paymentStep === 1">
        <div slot="title">
          <div class="circle-icon bg-success">
            <BaseIcon name="check"></BaseIcon>
          </div>
          <h4 style="margin-bottom: 10px">付款方式</h4>
        </div>
        <template v-if="isPrepaidAndEdit && !submitData.prepaidOrderUuid">
            <el-form :model="submitData" :rules="submitRules">
              <el-form-item class="el-form-item--white-bg-border text-center" label="請選擇包月方案">
                <el-select v-model="catchPrepaidOrderUuid">
                  <el-option v-for="(item, index) in prepaidListAfterService" :key="index" :disabled="item.status !== 1" :value="item.id" :label="item.prepaidTitle">
                    {{item.prepaidTitle}}
                    <span v-if="item.status === 1" class="select__option--meta">{{ `(尚餘${item.times - item.used}次)` }}</span>
                    <span v-else class="select__option--meta">{{ '未付款' }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>

            <!-- <el-button type="primary" class="is-round is-fullwidth" :disabled="tryingStore" :loading="tryingStore" @click="goToExtrafields(true)"> 確認 </el-button> -->
            <!-- <el-button class="is-round is-fullwidth"> 稍後付款 </el-button> -->
          </template>
        <div v-if="paymentWay === 'offline'">
          <el-button type="primary" class="is-round is-fullwidth" :disabled="isPrepaidAndEdit && !submitData.prepaidOrderUuid && !catchPrepaidOrderUuid" @click="selectPayment('Cash')"> 到店付款(現金) </el-button>
          <el-button type="primary" class="is-round is-fullwidth" :disabled="isPrepaidAndEdit && !submitData.prepaidOrderUuid && !catchPrepaidOrderUuid" @click="selectPayment('StoreCredit')"> 現場信用卡 </el-button>
          <el-button type="primary" class="is-round is-fullwidth" :disabled="isPrepaidAndEdit && !submitData.prepaidOrderUuid && !catchPrepaidOrderUuid" @click="selectPayment('Atm')"> 線下匯款 </el-button>
        </div>
        <div v-if="paymentWay === 'online'">
          <el-button type="primary" class="is-round is-fullwidth" :disabled="isPrepaidAndEdit && !submitData.prepaidOrderUuid && !catchPrepaidOrderUuid" @click="selectPayment('Credit')"> 線上信用卡 </el-button>
          <el-button type="primary" class="is-round is-fullwidth" :disabled="isPrepaidAndEdit && !submitData.prepaidOrderUuid && !catchPrepaidOrderUuid" @click="selectPayment('Vacc')"> 虛擬帳戶 </el-button>
        </div>
      </template>
      <template v-if="paymentStep === 2">
        <div slot="title">
          <div style="position: relative; transform: none; margin-bottom: 0" class="el-message-box__status el-icon-warning"></div>

          <h4 style="margin-bottom: 10px">
            {{ paymentTitle }}
          </h4>
        </div>
        <template v-if="!isChildren">
          
          <template v-if="submitData.paymentMethod === 'Cash'">
            <div class="" style="margin-bottom: 15px">客人是否已付款</div>
            <el-button type="primary" class="is-round is-fullwidth" :disabled="tryingStore" :loading="tryingStore" @click="goToExtrafields(true)"> 是 </el-button>
            <el-button class="is-round is-fullwidth" :disabled="tryingStore" :loading="tryingStore" @click="goToExtrafields(false)"> 否 </el-button>
          </template>
          <template v-if="submitData.paymentMethod === 'StoreCredit'">
            <div class="" style="margin-bottom: 15px">信用卡末四碼</div>
            <div class="el-form-item el-form-item--white-bg-border">
              <template v-if="!submitDataPrepaid.prepaidId">
                <el-input v-model="submitData.Card4No" placeholder="請輸入"> </el-input>
              </template>
              <template v-else>
                <el-input v-model="submitDataPrepaid.Card4No" placeholder="請輸入"> </el-input>
              </template>
            </div>
            <el-button type="primary" class="is-round is-fullwidth" :disabled="tryingStore" :loading="tryingStore" @click="goToExtrafields(true)"> 確認 </el-button>
            <el-button class="is-round is-fullwidth" :disabled="tryingStore" :loading="tryingStore" @click="goToExtrafields(false)"> 稍後付款 </el-button>
          </template>
          <template v-if="submitData.paymentMethod === 'Atm'">
            <div class="" style="margin-bottom: 15px">匯款帳號末五碼</div>
            <div class="el-form-item el-form-item--white-bg-border">
              <template v-if="!submitDataPrepaid.prepaidId">
                <el-input v-model="submitData.PayerAccount5Code" placeholder="請輸入"> </el-input>
              </template>
              <template v-else>
                <el-input v-model="submitDataPrepaid.PayerAccount5Code" placeholder="請輸入"> </el-input>
              </template>
            </div>
            <el-button type="primary" class="is-round is-fullwidth" :disabled="tryingStore" :loading="tryingStore" @click="goToExtrafields(true)"> 確認 </el-button>
            <el-button class="is-round is-fullwidth" :disabled="tryingStore" :loading="tryingStore" @click="goToExtrafields(false)"> 稍後付款 </el-button>
          </template>
          <template v-if="submitData.paymentMethod === 'Vacc'">
            <el-form :model="submitData" :rules="submitRules">
              <el-form-item prop="bankType" class="el-form-item--white-bg-border" label="轉帳銀行">
                <template v-if="!submitDataPrepaid.prepaidId">
                  <el-select v-model="submitData.bankType">
                    <el-option v-for="(bank, index) in bankTypeList" :key="`bank-${index}`" :value="bank.id" :label="bank.title"></el-option>
                  </el-select>
                </template>
                <template v-else>
                  <el-select v-model="submitDataPrepaid.bankType">
                    <el-option v-for="(bank, index) in bankTypeList" :key="`bank-${index}`" :value="bank.id" :label="bank.title"></el-option>
                  </el-select>
                </template>
              </el-form-item>
            </el-form>

            <el-button type="primary" class="is-round is-fullwidth" :disabled="tryingStore" :loading="tryingStore" @click="goToExtrafields(false)"> 確認 </el-button>
            <!-- <el-button class="is-round is-fullwidth"> 稍後付款 </el-button> -->
          </template>
          <template v-if="submitData.paymentMethod === 'Prepaid'">
            <el-form :model="submitData" :rules="submitRules">
              <el-form-item class="el-form-item--white-bg-border text-center" label="請選擇包月方案">
                <el-select v-model="submitData.prepaidOrderUuid">
                  <el-option v-for="(item, index) in prepaidListAfterService" :key="index" :disabled="item.status !== 1" :value="item.id" :label="item.prepaidTitle">
                    {{item.prepaidTitle}}
                    <span v-if="item.status === 1" class="select__option--meta">{{ `(尚餘${item.times - item.used}次)` }}</span>
                    <span v-else class="select__option--meta">{{ '未付款' }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>

            <el-button type="primary" class="is-round is-fullwidth" :disabled="tryingStore" :loading="tryingStore" @click="goToExtrafields(true)"> 確認 </el-button>
            <!-- <el-button class="is-round is-fullwidth"> 稍後付款 </el-button> -->
          </template>
        </template>
        <template v-else>
          <template v-if="childrenSubmitData.paymentMethod === 'Cash'">
            <div class="" style="margin-bottom: 15px">客人是否已付款</div>
            <el-button type="primary" class="is-round is-fullwidth" :disabled="tryingStore" :loading="tryingStore" @click="goToExtrafields(true)"> 是 </el-button>
            <el-button class="is-round is-fullwidth" :disabled="tryingStore" :loading="tryingStore" @click="goToExtrafields(false)"> 否 </el-button>
          </template>
          <template v-if="childrenSubmitData.paymentMethod === 'StoreCredit'">
            <div class="" style="margin-bottom: 15px">信用卡末四碼</div>
            <div class="el-form-item el-form-item--white-bg-border">
            
                <el-input v-model="childrenSubmitData.Card4No" placeholder="請輸入"> </el-input>
            
           
            </div>
            <el-button type="primary" class="is-round is-fullwidth" :disabled="tryingStore" :loading="tryingStore" @click="goToExtrafields(true)"> 確認 </el-button>
            <el-button class="is-round is-fullwidth" :disabled="tryingStore" :loading="tryingStore" @click="goToExtrafields(false)"> 稍後付款 </el-button>
          </template>
          <template v-if="childrenSubmitData.paymentMethod === 'Atm'">
            <div class="" style="margin-bottom: 15px">匯款帳號末五碼</div>
            <div class="el-form-item el-form-item--white-bg-border">
             
                <el-input v-model="childrenSubmitData.PayerAccount5Code" placeholder="請輸入"> </el-input>
       
           
            </div>
            <el-button type="primary" class="is-round is-fullwidth" :disabled="tryingStore" :loading="tryingStore" @click="goToExtrafields(true)"> 確認 </el-button>
            <el-button class="is-round is-fullwidth" :disabled="tryingStore" :loading="tryingStore" @click="goToExtrafields(false)"> 稍後付款 </el-button>
          </template>
          <template v-if="childrenSubmitData.paymentMethod === 'Vacc'">
            <el-form :model="childrenSubmitData" :rules="submitRules">
              <el-form-item prop="bankType" class="el-form-item--white-bg-border" label="轉帳銀行">
          
                  <el-select v-model="childrenSubmitData.bankType">
                    <el-option v-for="(bank, index) in bankTypeList" :key="`bank-${index}`" :value="bank.id" :label="bank.title"></el-option>
                  </el-select>
           
             
              </el-form-item>
            </el-form>

            <el-button type="primary" class="is-round is-fullwidth" :disabled="tryingStore" :loading="tryingStore" @click="goToExtrafields(false)"> 確認 </el-button>
            <!-- <el-button class="is-round is-fullwidth"> 稍後付款 </el-button> -->
          </template>
        
        </template>

      </template>
    </el-dialog>

    <!-- 備註 -->
    <el-dialog :visible.sync="extraDialogVisible" width="80%" top="0" title="備註" :close-on-click-modal="false" append-to-body>
      <el-form ref="extraForm" :model="submitData" :rules="submitRules" label-position="top" class="el-form-item--normal-margin">
        <div style="display: flex; margin-bottom: 10px"> <h6 style="margin-top: 0">使用人</h6> <el-checkbox v-model="userSameAsMember" class="check-by-head">使用人同客戶</el-checkbox> </div>
        <el-row :gutter="20">
          <el-col :span="7">
            <el-form-item prop="fullName" class="el-form-item--white-bg-border" label="姓名">
              <el-input v-model="submitData.fullName" :disabled="userSameAsMember" placeholder="姓名"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item class="gender-box" prop="gender">
              <el-radio-group v-model="submitData.gender" class="no-bg-radio-group">
                <el-radio label="male">先生</el-radio>
                <el-radio label="female">小姐</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="phoneNumber" class="el-form-item--white-bg-border" label="電話">
              <el-input v-model="submitData.phoneNumber" :disabled="userSameAsMember" placeholder="手機號碼" autocomplete="tel">
                <CountryCodePicker slot="prepend" v-model="submitData.phoneCode" :disabled="userSameAsMember" />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form class="el-form-item--normal-margin el-form--label-top">
        <OrderExtraField ref="extrafield" :default-value="{ byOrderExtrafields: submitData.byOrderExtrafields, customerInfos: [] }" />
        <el-form-item label="使用人備註">
          <small style="display: block; opacity: 0.5; line-height: 1.3; margin-bottom: 10px">客戶可瀏覽此備註。若是不需要提供客戶瀏覽的資訊，請使用「內部備註」功能</small>
          <el-input v-model="submitData.note" type="textarea" :rows="2"></el-input>
        </el-form-item>
      </el-form>
      <el-button class="is-round is-fullwidth" type="primary" :loading="tryingStore" :disabled="tryingStore" @click="handleCreateOrder"> 儲存並完成 </el-button>
    </el-dialog>

    <!-- 取消訂單 -->
    <OrderChangeStatusDialog :visible.sync="statusDialogVisible" :order="{ ...currentOrder, status: 0 }" @cancelled="updateOrder" />
  </div>
</template>
<style lang="scss" module>
@import '@design';
.orderformSection {
  // display: flex;
  // flex-wrap: wrap;
  // height: 100%;
  :global {
    .form-block-title {
      font-size: 16px;
      padding-bottom: 0;
      margin-top: 0;
    }
    .el-form-item {
      // margin-bottom: 10px;
    }
    .el-tabs__active-bar {
      background-color: $color-primary !important;
    }
    .search-box {
      min-width: 400px;
      margin-top: 60px;
      &__wrapper {
        display: flex;
        // align-items: center;
        justify-content: center;
        // height: calc(100vh - 348px);
      }
    }
    .search-section {
      height: 100%;
    }
    .info-section {
      padding: 30px 40px;
    }
    .orderformSection {
      &__all {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        height: 100%;
        // display: none;
      }

      &__left {
        width: 58%;
        border-right: $color-border-base 1px solid;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        &__content {
          height: 100vh;
          overflow: auto;

          padding-bottom: 90px;
        }
      }
      &__right {
        position: relative;
        width: 42%;
        .orderformSection__right__header {
          background-color: #f2f2f2;
          z-index: 999;
        }

        &__title {
          margin: 0;
          padding: 19px 0;
          padding-left: 50px;
        }
        &__header {
          position: relative;
          border-bottom: $color-border-base 1px solid;
          .el-drawer__close-btn {
            // font-weight: 300;
            color: #72767b;
            position: absolute;
            padding: 15px;
            border: 0;
            left: 0;
            top: 3px;
          }
          .el-tabs__item {
            height: auto;
            padding: 10px 0;
          }
          .el-tabs__nav-wrap::after {
            display: none;
          }
          .el-tabs__header {
            margin-bottom: 0;
          }
          .el-tabs--top {
            margin-left: 60px;
          }
        }
        &__content {
          z-index: 10;
          height: calc(100vh - 60px);
          overflow: auto;
          padding: 30px;
          padding-bottom: 120px;
          position: relative;
          background-color: #f2f2f2;
        }
      }
      &__bottom {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 30px;
        background: #fff;
        box-shadow: 0 -5px 5px rgba(#eee, 0.3);
        z-index: 999;
        &__btn {
          width: 40%;
        }
        &__btn-item {
          min-width: 132px;
          // width: 100%;
        }
      }
    }
  }
}

.header {
  margin-top: 30px;
  // margin-bottom: 30px;
  padding-left: 60px;
  padding-bottom: 10px;
  border-bottom: $color-border-base 1px solid;
  :global {
    h5 {
      font-size: 16px;
    }
  }
}
.title:not(:first-child) {
  margin-top: 30px;
}

.infoList {
  // margin-bottom: 30px;
  padding-top: 5px;
  // border-bottom: 1px solid $color-border-base;
  // font-size: 16px;
  :global {
    .muted {
      color: $color-text-secondary;
    }
    .el-tag + .el-tag {
      margin-left: 10px;
    }
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
}
.detail li {
  line-height: 40px;
}
// 地址
.footer {
  display: flex;
  :global {
    button {
      flex: 1 0 auto;
    }
  }
}

// 寵物
.petListImg {
  border-radius: 10px;
  overflow: hidden;
  height: 70px;
}
.pet {
  // font-size: 18px;
  :global {
    .danger {
      color: $color-state-danger;
    }
    .top {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
    }
    .pet {
      &__back {
        cursor: pointer;
      }
      &__box {
        margin-bottom: 30px;
      }
      &__info {
        &__list {
        }
        &__item {
          margin-bottom: 18px;
        }
      }
    }
    .notice {
      margin-bottom: 30px;
      h5 {
        font-size: 18px;
      }
      line-height: 1.5;
    }
  }
}
.petList {
  display: flex;
  align-items: center;
  border: $color-border-base 1px solid;
  background: #fff;
  border-radius: 7px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  &:global {
    &.isActive {
      border-color: $color-primary;
    }
  }
  // justify-content: space-between;
  :global {
    .petList {
      &__img {
        width: 80px;
        border: 0;
        height: 80px;
        display: block;
        background: #bbb;
        margin-right: 20px;
        min-width: 80px;
        border-radius: 50%;
        overflow: hidden;
      }
      &__cont {
        width: calc(100% - 100px);
      }
      &__btn {
        background-color: #eff9fb;
        cursor: pointer;
        padding: 12px;
        border-radius: 7px;
      }
    }
  }
}

// 服務

.price {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: $color-border-base 1px solid;
  &:global {
    &:hover {
      .price__title {
        color: $color-primary;
        transition: all 0.35s;
      }
    }
    &.isActive {
      .price__title {
        color: $color-primary;
        // transition: all 0.35s;
      }
    }
    &.isDisabled{
      pointer-events:none
    }
  }

  :global {
    .price {
      &__image {
        width: 50%;
        height: 10vw;
        border: 0;
      }
      &__cont {
        width: 50%;
        padding-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      &__title {
        font-weight: 500;
        margin-bottom: 10px;
        padding-top: 10px;
      }
    }
    .text-muted-0 {
      font-size: 14px;
    }
  }
}
.prepaid {
  :global {
    .prepaid {
      &__image {
        width: 100%;
        height: 20vw;
        border: 0;
        margin-bottom: 10px;
      }
      &__title {
        font-weight: 500;
      }
    }
  }
}

// 變價
:global {
  .children__bottom {
    padding: 30px 30px 0;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: $color-border-base 1px solid;
    h6 {
      margin-top: 0;
    }
    :global {
      .el-radio-group {
        display: flex;
      }
      .el-radio {
        margin-right: 0;
        padding-right: 12px;
        border-radius: 7px;
        margin-left: 0;
        width: 100%;
        background-color: #fff;
      }
    }
  }
  .payment-radio {
    // padding: 30px 30px 0;
    // position: absolute;
    // left: 0;
    // bottom: 0;
    width: 100%;
    // border-top: $color-border-base 1px solid;
    h6 {
      margin-top: 0;
    }
    :global {
      .el-radio-group {
        display: flex;
        flex-wrap: wrap;
        margin-right: -15px;
      }
      .el-radio {
        margin-right: 15px;
        // padding-right: 12px;
        border-radius: 7px;
        margin-left: 0 !important;
        width: calc(50% - 15px);
        background-color: #fff;
        margin-bottom: 15px;
      }
    }
  }
}
.total {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 100%;
  z-index: 1;
  :global {
    .total {
      &__cont {
        // padding: 30px 30px;
        height: calc(100% - 80px);
      }
      &__bottom {
        padding: 30px 30px;
        position: absolute;
        bottom: 80px;
        width: 100%;
        border-top: $color-border-base 1px solid;
        h6 {
          margin-top: 0;
        }
        :global {
          .el-radio-group {
            display: flex;
          }
          .el-radio {
            margin-right: 0;
            padding-right: 12px;
            border-radius: 7px;
            margin-left: 0;
            width: 100%;
            background-color: #fff;
          }
        }
      }
    }
  }
}
.bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 30px 0;
}

.editOneLine {
  display: flex;
  align-items: center;
  position: relative;
  flex-wrap: wrap;
  margin-bottom: 10px;
  :global {
    .el-form-item__error {
      position: static;
      width: 100%;
      padding-left: 80px;
    }
    .editOneLine {
      &__title {
        margin: 0;
        // margin-right: 15px;
      }
      &__text {
        font-size: 1.2rem;
        margin-right: 15px;
      }
    }
    .el-form-item {
      margin-bottom: 0;
      margin-right: 15px;
      &.isFull {
        margin-bottom: 20px;
      }
    }
    .el-input__inner {
      background-color: #fff;
      height: 40px;
    }
  }
}
.titleBox {
  padding: 20px;
  background: #fff;
}
.box {
  display: flex;
  flex-wrap: wrap;
  // padding: 20px 20px 10px;
  // background: #fff;
  margin-bottom: 20px;
  :global {
    li {
      //  width: 50%;
      margin-bottom: 15px;
      margin-right: 30px;
    }
    .row-line {
      width: 100%;
    }
  }
}
.info {
  padding-inline-start: 0;
  > li {
    display: inline-block;
    color: #909399;
    padding: 5px 0;
    margin-right: 15px;
  }
}
.share {
  &__buttons {
    display: flex;
    align-items: center;
    text-align: center;
  }
  &__button {
    flex: 1;
  }
  &__icon {
    font-size: 3rem;
  }
  &__label {
    margin-top: 10px;
  }
}
.invoice {
  :global {
    .order-id {
      font-size: 16px;
      letter-spacing: 1.6px;
      line-height: 18px;
      margin-bottom: 20px;
      font-weight: 500;
    }
    .info {
      padding: 22.5px 20px;
      background: white;
      @include touch {
        border: 1px solid #c6c6ba;
      }
      .el-col {
        padding-top: 7.5px;
        padding-bottom: 7.5px;
      }
      .info-item {
        .title {
          width: 60px;
          display: inline-block;
          color: #919191;
          margin-right: 20px;
        }
        & + .info-item {
          margin-top: 15px;
        }
      }
    }
  }
  & + .invoice {
    margin-top: 40px;
  }
}
</style>
