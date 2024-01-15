<template>
  <section class="clients">
    <div class="clients__wrapper p-4 table-responsive small">
      <div class="table-title d-flex justify-content-between mb-3">
        <h3 class="d-inline-flex">Сделки</h3>
        <button
          type="button"
          @click="showModal = true"
          class="d-inline-flex align-items-center btn px-4 nav-pills"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          style="background-color: #74aa0e; color: white; border: gray;"
        >
          Добавить сделку
        </button>
      </div>
      <div v-if="editId > -1" @submit.prevent="onSubmit" class="modal">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content p-2">
            <div class="modal-body row d-flex g-2">
              <div class="modal-header">
                <h5 class="modal-title fw-bold mb-0 fs-4">
                  Редактировать сделку
                </h5>
                <button
                  type="button"
                  class="btn btn-close"
                  @click="cancelChanges"
                ></button>
              </div>
              <div class="modal-body row d-flex g-2">
                <div class="form-floating mb-3">
                  <select
                    id="demand"
                    v-model="content.Demand_Id"
                    class="form-select"
                    aria-label="Потребность"
                  >
                    <option
                      v-for="demand in demands"
                      :key="demand.Id"
                      :value="demand.Id"
                    >
                      {{ outputDemand(demand) }}
                    </option>
                  </select>
                  <label for="demand" class="required">Потребность</label>
                </div>
                <div class="form-floating mb-3">
                  <select
                    id="supply"
                    v-model="content.Supply_Id"
                    class="form-select"
                    aria-label="Предложение"
                  >
                    <option
                      v-for="supply in supplies"
                      :key="supply.Id"
                      :value="supply.Id"
                    >
                      Предложение #{{ outputSupply(supply) }}
                    </option>
                  </select>
                  <label for="supply" class="required">Предложение</label>
                </div>
                <div
                  class="mb-3 form-floating align-self-end d-flex justify-content-end"
                >
                  <button
                    @click="cancelChanges"
                    class="w-30 mx-2 btn btn-secondary nav-pills"
                  >
                    Отмена
                  </button>
                  <button
                    class="w-30 mx-2 btn btn-primary nav-pills"
                    @click="saveChanges(editId)"
                    :disabled="!isValidForm"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table class="table table-striped shadow-sm">
        <thead>
          <tr>
            <th scope="col" class="table__item">id</th>
            <th scope="col" class="table__item">Потребность</th>
            <th scope="col" class="table__item">Предложение</th>
            <th scope="col" class="table__item">Действия</th>
          </tr>
        </thead>
        <tbody class="table-hover">
          <tr
            v-for="deal in filteredDeals"
            :key="deal.Id"
            :class="{ 'table-info': deal.Id == editId }"
          >
            <td class="table__item">
              <p class="table__input">{{ deal.Id }}</p>
            </td>
            <td class="table__item">
              <p class="table__input">{{ deal.Demand_Id }}</p>
            </td>
            <td class="table__item">
              <p class="table__input">{{ deal.Supply_Id }}</p>
            </td>
            <td>
              <div class="btn-group row">
                <button
                  class="btn-group__item"
                  @click="openModal = deal.Id"
                >
                  Комиссии
                </button>
                <button
                  class="btn-group__item"
                  @click="editById(deal.Id, deal)"
                >
                  Изменить
                </button>
                <button
                  class="btn-group__item"
                  @click="deleteModal = deal.Id"
                >
                  Удалить
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ModalOpen
      v-if="openModal > -1"
      :id="openModal"
      @close="openModal = -1"
      type="deal"
    />
    <ModalCreateDeal v-if="showModal" @close="showModal = false" />
    <ModalProofDelete
      v-if="deleteModal > -1"
      @close="deleteModal = -1"
      @proof="removeById(deleteModal)"
      >выбранную сделку #<b>{{ deleteModal }}</b
      >?</ModalProofDelete
    >
  </section>
</template>

<script>
import { useDealsStore } from "../store/deals";
import { useSuppliesStore } from "../store/supplies";
import { useDemandsStore } from "../store/demands";
import ModalCreateDeal from "./ModalCreateDeal.vue";
import ModalProofDelete from "./ModalProofDelete.vue";
import ModalOpen from "./ModalOpen.vue";

export default {
  components: {
    ModalCreateDeal,
    ModalProofDelete,
    ModalOpen,
  },
  data() {
    return {
      editId: -1,
      showModal: false,
      openModal: -1,
      deleteModal: -1,
      search: "",
      id: "",
      filterType: "all",
      supplies: useSuppliesStore().supplies,
      demands: useDemandsStore().demands,
      content: {
        Supply_Id: "",
        Demand_Id: "",
      },
    };
  },
  computed: {
    filteredDeals() {
      let arr = useDealsStore().deals;
      return arr;
    },
    isValidForm() {
      return !!this.content.Supply_Id & !!this.content.Demand_Id;
    },
  },
  methods: {
    removeById(id) {
      useDealsStore().removeDeal(id);
    },
    editById(id, obj) {
      this.editId = id;
      this.content.Supply_Id = obj.Supply_Id;
      this.content.Demand_Id = obj.Demand_Id;
    },
    saveChanges(id) {
      this.editId = -1;
      useDealsStore().changeDeal(id, this.content);
      console.log(id, this.content);
    },
    cancelChanges() {
      this.editId = -1;
    },
    outputSupply(supply) {
      return String(supply.Id) + " | Цена " + String(supply.Price) + " руб.";
    },
    outputDemand(supply) {
      return (
        "Потребность #" +
        supply.Id +
        " | Клиент " +
        supply["ClientId"] +
        " | Риэлтор #" +
        supply["AgentId"]
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.clients__wrapper {
  padding: 0 20px;
  max-width: 1440px;
  margin: 0 auto;
}

.table__button {
  cursor: pointer;
  text-transform: uppercase;
  border: none;
  border-radius: 4px;
  padding: 10px 12px;
  width: 124px;
  text-align: center;
  margin-right: 2px;
  background-color: rgb(169, 169, 169);
}

.clients__wrapper {
    padding: 0 20px;
    max-width: 1440px;
    margin: 0 auto;
}

.row.g-2 {
    margin-bottom: 20px;
}

.form-floating {
    margin-bottom: 15px;

    label {
        color: #343a40;
    }

    input,
    select {
        background-color: #f8f9fa;
        color: #495057;
        border: 1px solid #ced4da;
        border-radius: 8px;

        &:focus {
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }
    }
}

.btn-group__item:hover {
  background-color: rgb(72, 125, 217);
  color: #ffffff;
  width: 98%;
  border-radius: 15px;
}

/* Table Styles */
.table {
    thead {
        th {
            background-color: #105498;
            color: white;
        }
    }

    tbody {
        tr {
            transition: background-color 0.3s;

            &:hover {
                background-color: #f8f9fa;
            }
        }

        td {
            color: #495057;
            font-weight: normal;
        }

        .table__item {
            padding: 8px 12px;
        }
    }

    .table-info {
        background-color: #d1ecf1;
    }

}
</style>
