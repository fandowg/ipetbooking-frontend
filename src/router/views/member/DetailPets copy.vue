<script>



</script>

<template>
  <div>
    <BasePageHeader title="寵物管理">
      <template v-slot:title>
        <span v-if="!showDetailPet">寵物管理</span>
        <span v-if="showDetailPet">寵物資料</span>
      </template>
      <template v-slot:right>
        <el-button v-if="!showDetailPet" class="is-round" type="primary" @click="dialogVisiblePet = true">
          <BaseIcon name="plus" />
          <span>新增</span>
        </el-button>
      </template>
    </BasePageHeader>

    <template v-if="!showDetailPet">
      <div class="el-table-wrapper">
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
      </div>
    </template>

    <template v-else>
      <div class="pet__back" style="margin-bottom: 20px" @click="backToPetList"><i class="el-icon-back"></i> 返回寵物列表</div>
      <el-tabs v-model="activeTabPet" stretch type="border-card">
        <el-tab-pane label="寵物資訊" :name="`1`">
          <div :class="$style.pet">
            <div class="top">
              <div>
                <template v-if="!editPetEnabled">
                  <el-button size="mini" class="is-round" :disabled="tryingGetPet" @click="openEditPet">
                  
                    <span>編輯</span>
                  </el-button>
                </template>
                <template v-else>
                  <el-button class="is-round" size="mini" @click="editPetEnabled = false"><BaseIcon name="times" /> 取消</el-button>
                  <el-button class="is-round" size="mini" type="primary" @click="tryToSavePet"><BaseIcon name="check" /> 儲存</el-button>
                </template>
              </div>
            </div>
            <div class="pet__box">
              <el-form ref="form" :model="submitDataPet" :rules="submitPetRules" label-position="left" class="el-form--floating" :validate-on-rule-change="false" label-width="100px">
                <el-row :gutter="20" style="margin-bottom:30px">
                  <el-col :span="10">
                    <div class="pet__avatar">
                      <BaseUpload v-model="singlePetData.avatar" v-loading="tryingGetPet" resource="pet" circle dir="pet" @sendSuccess="uploadToStore" />
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <template v-if="editPetEnabled">
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
                      <el-form-item label="性別" prop="gender" class="el-form-item--normal-margin">
                        <el-select v-model="submitDataPet.gender">
                          <el-option label="母" value="female"></el-option>
                          <el-option label="公" value="male"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="生日" class="el-form-item--normal-margin">
                        <el-date-picker v-model="submitDataPet.birthday" type="date" value-format="yyyy-MM-dd"></el-date-picker>
                      </el-form-item>
                    </template>
                    <template v-else>
                      <div v-loading="tryingGetPet" class="pet__info">
                        <ul class="pet__info__list">
                          <li class="pet__info__item">寵物名<span class="danger">*</span>：{{ singlePetData.name }}</li>
                          <li class="pet__info__item">類別<span class="danger">*</span>：{{ singlePetData.categoryTitle }}</li>
                          <li class="pet__info__item">體型<span class="danger">*</span>：{{ singlePetData.sizeTitle }}</li>
                          <li class="pet__info__item">品種：{{ singlePetData.breed }}</li>
                          <li class="pet__info__item">性別：{{ singlePetData.gender === 'male' ? '公' : '母' }}</li>
                          <li class="pet__info__item">生日：{{ singlePetData.birthday }}</li>
                        </ul>
                      </div>
                    </template>
                  </el-col>
                </el-row>
                <div class="notice">
                  <h5>寵物問題：</h5>
                  <template v-if="editPetEnabled">
                 
                    <el-form-item label="個性" class="el-form-item--normal-margin">
                      <el-checkbox-group v-model="submitDataPet.questions.personality">
                        <el-checkbox v-for="item in questions.personality" :key="item.name" :label='item.title'>{{item.title}}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="健康狀況" class="el-form-item--normal-margin">
                      <el-checkbox-group v-model="healthy">
                        <template v-for="item in questions.healthy">
                     
                          <el-checkbox  :key="item.name" :label='item.title'>{{item.title}}</el-checkbox>
                          <!-- <el-checkbox  :label='item.title'>{{item.title}} </el-checkbox> -->
                          <el-input v-if="healthy.includes('其他疾病') && item.name === 'other'" :key="item.title" v-model="item.text"   placeholder="請填寫其他疾病"/>
                        </template>
                        
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="行為" class="el-form-item--normal-margin">
                      <el-checkbox-group v-model="behavior">
                        <template v-for="item in questions.behavior">
                          <div :key="item.title" class="inline-checkbox-input">
                            <el-checkbox  :key="item.name" :label='item.title'>{{item.title}}</el-checkbox>
                            <el-input v-model="item.text"/>
                          </div>
                        </template>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="疫苗" class="el-form-item--normal-margin">
                      <el-radio v-model="submitDataPet.questions.vaccine" :label="1">1 劑</el-radio>
                      <el-radio v-model="submitDataPet.questions.vaccine" :label="2">2 劑</el-radio>
                      <el-radio v-model="submitDataPet.questions.vaccine" :label="3">3 劑</el-radio>
                    </el-form-item>
                  </template>
                  <template v-else>
                  
                    <ul v-if="singlePetData.questions" class="pet__info__list">
                      <li class="pet__info__item">個性：{{ personalityContent ? personalityContent : '未填寫' }}</li>
                      <li class="pet__info__item">健康狀況：{{ healthyContent ? healthyContent : '未填寫' }}</li>
                      <li class="pet__info__item indentList">
                        <span class="title">行為：</span>
                        <template v-if="behaviorContent.length > 0">
                          <span class="content">
                            <span v-for="n in behaviorContent" :key="n" class="content__item">{{n}}</span>
                          </span>
                        </template>
                        <span v-else>未填寫</span>
                      </li>
                      <li class="pet__info__item">疫苗：{{ singlePetData.questions.vaccine ? vaccineContent : '未填寫' }}</li>
                    </ul>
                  </template>

                </div>
                <div class="notice">
                  <h5>內部備註：</h5>
                  <template v-if="editPetEnabled">
                    <el-form-item label="" label-width="0">
                      <el-input v-model="submitDataPet.note" type="textarea" :rows="2"></el-input>
                      <!-- <BaseInputFloatingLabel v-model="pet.remark" type="textarea" :autosize="{ minRows: 2 }" /> -->
                    </el-form-item>
                  </template>
                  <template v-else>
                    <div> {{ singlePetData.note }}</div>
                  </template>
                </div>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="寵物備註" :name="`2`"><PetCommentList v-if="singlePetData.id" ref="commentAll" :order="undefined" :pet="singlePetData.id" type="pet" /> </el-tab-pane>
      </el-tabs>
    </template>

    <BaseButtonDialog title="寵物資料" only-dialog :dialog-visible.sync="dialogVisiblePet" floating @opened="openDialog('add')">
      <!-- <div v-if="dialogMode === 'view'">
            <ListItem :data="dialogItem" show-detail @edit="dialogMode = 'edit'" @close="closeDialog" />
          </div> -->
      <PetForm :default-value="memberInfo" :category="category" @close="closeDialog" />
    </BaseButtonDialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
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
</style>