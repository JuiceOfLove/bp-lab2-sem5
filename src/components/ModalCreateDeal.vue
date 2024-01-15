<template>
    <div class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content p-2 ">
                <div class="modal-header">
                    <h5 class="modal-title fw-bold mb-0 fs-4">Добавить сделку</h5>
                    <button type="button" class="btn btn-close" @click="$emit('close')"></button>
                </div>
                    <form @submit.prevent="onSubmit">
                        <div class="modal-body row g-2">
                            <div class="form-floating mb-3">
                                <select id="supply" v-model="Supply_Id" class="form-select" aria-label="Предложение">
                                    <option v-for="supply in filteredSupplies" :key="supply.Id" :value="supply.Id">Предложение #{{outputSupply(supply)}}</option>
                                </select>
                                <label for="supply" class="required">Предложение</label>
                            </div>
                            <!-- Рекомендованные предложения:
                            <div class="row row-cols-5 me-2 d-flex justify-content-around">
                                <button type="button" @click="updateSupply(rec.Id)" class="btn btn-outline-info m-1 p-2" v-for="rec in isRecomandations"><p style="font-size: 12px; margin: 0">#{{rec.Id}} {{rec.Price}}руб.</p></button>
                            </div> -->
                            <div class="form-floating mb-3">
                                <select id="demand" v-model="Demand_Id" class="form-select" aria-label="Потребность">
                                    <option v-for="demand in filteredDemands" :key="demand.Id" :value="demand.Id">{{outputDemand(demand)}}</option>
                                </select>
                                <label for="demand" class="required">Потребность</label>
                            </div>
                            <!-- Рекомендованные потребности
                            <div class="row row-cols-5 me-2 d-flex justify-content-around">
                                <button type="button" @click="updateDemand(rec.Id)" class="btn btn-outline-success m-1 p-2" v-for="rec in isRecomandationsOffers"><p style="font-size: 12px; margin: 0">#{{rec.Id}}, Клиент: {{rec.ClientId}}, Риэлтор: {{rec.AgentId}}</p></button>
                            </div> -->
                        </div>
                        <div class="modal-footer form-group">
                            <button class="w-40 mb-2 btn btn-secondary nav-pills" @click="$emit('close')">
                                Отмена
                            </button>
                            <button class="w-40 mb-2 btn btn-primary nav-pills" @submit="this.onSubmit" :disabled="!isValidForm">Добавить сделку</button>
                        </div>
                    </form>
            </div>
        </div>
    </div>
</template>
  
<script>
import { useDealsStore } from '../store/deals'
import { useSuppliesStore } from '../store/supplies';
import { useDemandsStore } from '../store/demands';

export default {
    emits: ['close'],
    data() {
        return {
            type: 'apartment',
            supplies: useSuppliesStore().supplies,
            demands: useDemandsStore().demands,
            Demand_Id: '',
            Supply_Id: '',
        }
  },
  computed: {
    filteredDemands(){
        return this.demands.filter(demand => !this.checkIdDemand(demand.Id, useDealsStore().deals))
    },
    filteredSupplies(){
        return this.supplies.filter(supply => !this.checkIdSupply(supply.Id, useDealsStore().deals))
    },
    isValidForm() {
        return true;
    },
    isRecomandations(){
        if (this.Demand_Id !== ''){
            let pricesDemand = [this.demands.filter(i => i.Id == this.Demand_Id)[0].MinPrice,this.demands.filter(i => i.Id == this.Demand_Id)[0].MaxPrice]
            let areaDemand = [this.demands.filter(i => i.Id == this.Demand_Id)[0].MinArea,this.demands.filter(i => i.Id == this.Demand_Id)[0].MaxArea]
            pricesDemand[0]==''?pricesDemand[0]=0:false; pricesDemand[1]=='' || pricesDemand[1]==null?pricesDemand[1]=999999999:false
            areaDemand[0]==''|| areaDemand[0]==null?areaDemand[0]=0:false; areaDemand[1]=='' || areaDemand[1]==null?areaDemand[1]=999999999:false
            let list = this.supplies.filter(item => item.Price <= pricesDemand[1] & pricesDemand[0] <= item.Price)
            list = list.filter(item => !(this.filteredSupplies.indexOf(item) == -1))
            return list
        }
        return false;
    },
    isRecomandationsOffers() {
        if (this.Supply_Id !== '') {
            const price = this.supplies.find(item => item.Price);
            const filteredDemands = this.demands.filter(demand => {
                if ((!demand.MinPrice || price >= demand.MinPrice) &&
                    (!demand.MaxPrice || price <= demand.MaxPrice)) {
                    return true;
                }
                return false;
            }).filter(demand => !this.checkIdDemand(demand.Id, useDealsStore().deals))
        return filteredDemands;
        }
    return false;
    }
  },
  methods: {
    updateSupply(id) {
        this.Supply_Id = id;
    },
    updateDemand(id) {
        this.Demand_Id = id;
    },
    outputSupply(supply){
        return String(supply.Id)+' | Цена '+String(supply.Price)+' руб.'
    },
    outputDemand(supply){
        return 'Потребность #'+supply.Id+' | Клиент '+supply['ClientId']+' | Риэлтор #'+supply['AgentId']
    },
    onSubmit() {
      if (!this.isValidForm) return
      let deal = {
        Demand_Id: this.Demand_Id,
        Supply_Id: this.Supply_Id, 
        Id: useDealsStore().deals[useDealsStore().deals.length - 1].Id + 1
      }
      useDealsStore().addDeal(deal);
      this.$emit('close');
    },
    checkIdDemand(id, array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].Demand_Id === id) {
                return true;
            }
        }
        return false;
    },
    checkIdSupply(id, array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].Supply_Id === id) {
                return true;
            }
        }
        return false;
    }
  }
}
</script>
<style lang="scss">
.modal {
    display: block !important;
}
</style>