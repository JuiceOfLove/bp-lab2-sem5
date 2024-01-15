<template>
  <section class="clients">
    <div class="clients__wrapper p-4 table-responsive small">
      <div class="table-title d-flex justify-content-between mb-3">
        <h3 class="d-inline-flex">Предложения</h3>
        <button
          type="button"
          @click="showModal = true"
          class="d-inline-flex align-items-center btn px-4 nav-pills"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          style="background-color: gray; color: white; border: gray;"
        >
          Добавить предложение
        </button>
      </div>
      <div v-if="editId > -1" @submit.prevent="onSubmit" class="modal">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content p-2">
            <div class="modal-body row d-flex g-2">
              <div class="modal-header">
                <h5 class="modal-title fw-bold mb-0 fs-4">
                  Редактировать предложение
                </h5>
                <button
                  type="button"
                  class="btn btn-close"
                  @click="cancelChanges"
                ></button>
              </div>
              <div class="form-floating mb-3">
                <select
                  id="demand"
                  v-model="content.ClientId"
                  class="form-select"
                  aria-label="Клиент"
                >
                  <option
                    v-for="client in clients"
                    :key="client.Id"
                    :value="client.Id"
                  >
                    {{ client.Id }} {{ client.FirstName }}
                    {{ client.MiddleName }} {{ client.LastName }}
                  </option>
                </select>
                <label for="demand" class="required">Клиент</label>
              </div>
              <div class="form-floating mb-3">
                <select
                  id="type"
                  v-model="content.AgentId"
                  class="form-select"
                  aria-label="Объект недвижимости"
                >
                  <option
                    v-for="agent in agents"
                    :key="agent.Id"
                    :value="agent.Id"
                  >
                    {{ agent.Id }} {{ agent.FirstName }} {{ agent.MiddleName }}
                    {{ agent.LastName }} (доля комиссии {{ agent.DealShare }})
                  </option>
                </select>
                <label for="type" class="required">Риэлтор</label>
              </div>
              <div class="form-floating mb-3">
                <select
                  id="type"
                  v-model="content.RealEstateId"
                  class="form-select"
                  aria-label="Объект недвижимости"
                >
                  <option
                    v-for="object in objects"
                    :key="object.Id"
                    :value="object.Id"
                  >
                    {{ object.Id }} {{ object.Address_City }}
                    {{ object.Address_Street }} дом
                    {{ object.Address_House }} кв.
                    {{ object.Address_Number }} площадь {{ object.TotalArea }}
                  </option>
                </select>
                <label for="type" class="required">Объект недвижимости</label>
              </div>
              <div class="form-floating mb-3">
                <input
                  required
                  id="Address_Number"
                  v-model="content.Price"
                  type="number"
                  class="form-control rounded-3"
                />
                <label for="Address_Number" class="required">Цена</label>
                <small id="Address_Number" class="form-text text-muted"
                  >Цена должна быть целым положительным числом</small
                >
              </div>
              <div
                class="mb-4 form-floating align-self-end d-flex justify-content-center"
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
      <table class="table table-striped shadow-sm">
        <thead>
          <tr>
            <th scope="col" class="table__item">id</th>
            <th scope="col" class="table__item">Клиент</th>
            <th scope="col" class="table__item col-2">Риэлтор</th>
            <th scope="col" class="table__item">Недвижимость</th>
            <th scope="col" class="table__item">Цена</th>
            <th scope="col" class="table__item">Действия</th>
          </tr>
        </thead>
        <tbody class="table-hover">
          <tr
            v-for="supply in filteredSupplies"
            :key="supply.Id"
            :class="{ 'table-info': supply.Id == editId }"
          >
            <td class="table__item">
              <p class="table__input" :disabled="this.editId !== supply.Id">
                {{ supply.Id }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input" :disabled="this.editId !== supply.Id">
                {{ supply.ClientId }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input" :disabled="this.editId !== supply.Id">
                {{ supply.AgentId }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input" :disabled="this.editId !== supply.Id">
                {{ supply.RealEstateId }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input" :disabled="this.editId !== supply.Id">
                {{ supply.Price }}
              </p>
            </td>
            <td>
              <!-- <div class="btn-group row">
                <button
                  style="width: 38px; height: 38px"
                  class="mx-2 rounded-square p-2 lh-1 btn btn-outline-primary"
                  @click="editById(supply.Id, supply)"
                >
                  <i class="bi-pencil-square"></i>
                </button>
                <button
                  style="width: 38px; height: 38px"
                  class="rounded-square p-2 lh-1 btn btn-danger"
                  @click="deleteModal = supply.Id"
                  :disabled="!supplyInDeal(supply.Id)"
                >
                  <i class="bi-trash"></i>
                </button>
              </div> -->
              <div class="btn-group row">
                  <button
                    class="btn-group__item"
                    @click="editById(supply.Id, supply)"
                    >
                  Изменить
                  </button>
                  <button
                    class="btn-group__item"
                    @click="deleteModal = supply.Id"
                    :disabled="!supplyInDeal(supply.Id)"
                  >
                  Удаление
                  </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ModalCreateOffer v-if="showModal" @close="showModal = false" />
    <ModalProofDelete
      v-if="deleteModal > -1"
      @close="deleteModal = -1"
      @proof="removeById(deleteModal)"
      >выбранное предложение #<b>{{ deleteModal }}</b
      >?</ModalProofDelete
    >
  </section>
</template>

<script>
import { useDealsStore } from "../store/deals";
import { useSuppliesStore } from "../store/supplies";
import { useObjectsStore } from "../store/objects";
import { useClientsStore } from "../store/clients";
import { useAgentsStore } from "../store/agents";
import ModalCreateOffer from "../components/ModalCreateOffer.vue";
import ModalProofDelete from "./ModalProofDelete.vue";

export default {
  components: {
    ModalCreateOffer,
    ModalProofDelete,
  },
  data() {
    return {
      editId: -1,
      showModal: false,
      deleteModal: -1,
      search: "",
      id: "",
      filterType: "all",
      objects: useObjectsStore().objects,
      clients: useClientsStore().clients,
      agents: useAgentsStore().agents,
      content: {
        AgentId: "",
        ClientId: "",
        RealEstateId: "",
        Price: "",
      },
    };
  },
  computed: {
    filteredSupplies() {
      let arr = useSuppliesStore().supplies;
      return arr;
    },
    isValidForm() {
      return (
        Number.isInteger(this.content.Price) &
        !!this.content.Price &
        !!this.content.RealEstateId &
        !!this.content.AgentId &
        !!this.content.ClientId &
        (this.content.Price > 0)
      );
    },
  },
  methods: {
    removeById(id) {
      useSuppliesStore().removeSupply(id);
    },
    editById(id, obj) {
      this.editId = id;
      this.content.AgentId = obj.AgentId;
      this.content.ClientId = obj.ClientId;
      this.content.RealEstateId = obj.RealEstateId;
      this.content.Price = obj.Price;
      this.content.Id = obj.Id;
    },
    saveChanges(id) {
      this.editId = -1;
      useSuppliesStore().changeSupply(id, this.content);
      console.log(id, this.content);
    },
    cancelChanges(id) {
      this.editId = -1;
      useSuppliesStore().fetchSupplies();
    },

    supplyInDeal(id) {
      for (let i = 0; i < useDealsStore().deals.length; i++) {
            if (useDealsStore().deals[i].Supply_Id === id) {
                return false;
            }
        }
        return true;
    }
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

.modal {
  display: block !important;
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

/* Table Styles */
.table {
    thead {
        th {
            background-color: #343a40;
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
