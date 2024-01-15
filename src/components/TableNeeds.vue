<template>
  <section class="clients">
    <div class="clients__wrapper p-4 table-responsive small">
      <div class="table-title d-flex justify-content-between mb-3">
        <h3 class="d-inline-flex">Потребности</h3>
        <button
          type="button"
          @click="showModal = true"
          class="d-inline-flex align-items-center btn px-4 nav-pills"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          style="background-color: gray; color: white; border: gray;"
        >
          Добавить потребность
        </button>
      </div>
      <div v-if="editId > -1" @submit.prevent="onSubmit" class="modal">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content p-2">
            <div class="modal-body row d-flex g-2">
              <div class="modal-header">
                <h5 class="modal-title fw-bold mb-0 fs-4">
                  Редактировать потребность
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
                    {{ client.MiddleName }}
                    {{ client.LastName }}
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
                    {{ agent.LastName }} (комиссия: {{ agent.DealShare }}%)
                  </option>
                </select>
                <label for="type" class="required">Риэлтор</label>
              </div>
              <div class="form-floating mb-3">
                <input
                  v-model="content.Address_City"
                  class="form-control rounded-3"
                  id="Address_City"
                />
                <label for="Address_City">Город</label>
              </div>
              <div class="form-floating mb-3">
                <input
                  v-model="content.Address_Street"
                  id="Address_Street"
                  class="form-control rounded-3"
                />
                <label for="Address_Street">Улица</label>
              </div>
              <div class="form-floating mb-3">
                <input
                  id="Address_House"
                  v-model="content.Address_House"
                  class="form-control rounded-3"
                />
                <label for="Address_House">Дом</label>
              </div>
              <div class="form-floating mb-3">
                <input
                  id="Address_Number"
                  v-model="content.Address_Number"
                  class="form-control rounded-3"
                />
                <label for="Address_Number">Квартира</label>
              </div>
              <div class="form-floating mb-3">
                <select
                  id="Type"
                  v-model="content.Type"
                  class="form-select"
                  aria-label="Тип объекта недвижимости"
                >
                  <option value="Квартира" selected>Квартира</option>
                  <option value="Дом">Дом</option>
                  <option value="Земля">Земля</option>
                </select>
                <label for="type">Тип объекта недвижимости</label>
              </div>
              <div
                v-if="content.Type == 'apartment' || content.Type == 'house'"
                class="form-floating mb-3"
              >
                <input
                  id="MinRooms"
                  v-model="content.MinRooms"
                  class="form-control rounded-3"
                />
                <label for="MinRooms">Минимальное кол-во комнат</label>
              </div>
              <div
                v-if="content.Type == 'apartment' || content.Type == 'house'"
                class="form-floating mb-3"
              >
                <input
                  id="MaxRooms"
                  v-model="content.MaxRooms"
                  class="form-control rounded-3"
                />
                <label for="MaxRooms">Максимальное кол-во комнат</label>
              </div>
              <div
                v-if="content.Type == 'apartment'"
                class="form-floating mb-3"
              >
                <input
                  id="MinFloors"
                  v-model="content.MinFloors"
                  class="form-control rounded-3"
                />
                <label for="MinFloors">Минимальный этаж</label>
              </div>
              <div
                v-if="content.Type == 'apartment'"
                class="form-floating mb-3"
              >
                <input
                  id="MaxFloors"
                  v-model="content.MaxFloors"
                  class="form-control rounded-3"
                />
                <label for="MaxFloors">Максимальный этаж</label>
              </div>
              <div
                v-if="content.Type == 'house'"
                class="form-floating mb-3"
              >
                <input
                  id="MinFloors"
                  v-model="content.MinFloors"
                  class="form-control rounded-3"
                />
                <label for="MinFloors">Минимальная этажность дома</label>
              </div>
              <div
                v-if="content.Type == 'house'"
                class="form-floating mb-3"
              >
                <input
                  id="MaxFloors"
                  v-model="content.MaxFloors"
                  class="form-control rounded-3"
                />
                <label for="MaxFloors">Максимальная этажность дома</label>
              </div>
              <div class="form-floating mb-3">
                <input
                  id="MinArea"
                  v-model="content.MinArea"
                  class="form-control rounded-3"
                />
                <label for="MinArea">Минимальная площадь</label>
              </div>
              <div class="form-floating mb-3">
                <input
                  id="MaxArea"
                  v-model="content.MaxArea"
                  class="form-control rounded-3"
                />
                <label for="MaxArea">Максимальная площадь</label>
              </div>
              <div class="form-floating mb-3">
                <input
                  required
                  id="MinPrice"
                  v-model="content.MinPrice"
                  type="number"
                  class="form-control rounded-3"
                />
                <label for="MinPrice" class="required">Минимальная цена</label>
                <small for="MinPrice" class="form-text text-muted"
                  >Минимальная цена должна быть целым положительным
                  числом</small
                >
              </div>
              <div class="form-floating mb-3">
                <input
                  required
                  id="MaxPrice"
                  v-model="content.MaxPrice"
                  type="number"
                  class="form-control rounded-3"
                />
                <label for="MaxPrice" class="required">Максимальная цена</label>
                <small id="MaxPrice" class="form-text text-muted"
                  >Максимальная цена должна быть целым положительным
                  числом</small
                >
              </div>
              <div
                class="mb-4 form-floating align-self-end d-flex justify-content-end"
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
    <div class="table__wrapper">
      <table class="table table-striped shadow-sm">
        <thead>
          <tr>
            <th scope="col" class="table__item">id</th>
            <th scope="col" class="table__item">Клиент</th>
            <th scope="col" class="table__item">Риэлтор</th>
            <th scope="col" class="table__item">Тип</th>
            <th scope="col" class="table__item">Город</th>
            <th scope="col" class="table__item">Улица</th>
            <th scope="col" class="table__item">Дом</th>
            <th scope="col" class="table__item">Квартира</th>
            <th scope="col" class="table__item">Мин. цена</th>
            <th scope="col" class="table__item">Макс. цена</th>
            <th scope="col" class="table__item">Мин. площадь</th>
            <th scope="col" class="table__item">Макс. площадь</th>
            <th scope="col" class="table__item">Мин. комнат</th>
            <th scope="col" class="table__item">Макс. комнат</th>
            <th scope="col" class="table__item">Мин. этаж</th>
            <th scope="col" class="table__item">Макс. этаж</th>
            <th scope="col" class="table__item">Действия</th>
          </tr>
        </thead>
        <tbody class="table-hover">
          <tr
            v-for="demand in filteredDemands"
            :key="demand.Id"
            :class="{ 'table-info': demand.Id == editId }"
          >
            <td class="table__item">
              <p class="table__input">
                {{ demand.Id }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input">
                {{ demand.ClientId }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input">
                {{ demand.AgentId }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input">
                {{ demand.Type }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input">
                {{ demand.Address_City }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input">
                {{ demand.Address_Street }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input">
                {{ demand.Address_House }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input">
                {{ demand.Address_Number }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input">
                {{ demand.MinPrice }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input">
                {{ demand.MaxPrice }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input">
                {{ demand.MinArea }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input">
                {{ demand.MaxArea }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input">
                {{ demand.MinRooms }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input">
                {{ demand.MaxRooms }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input">
                {{ demand.MinFloor }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input">
                {{ demand.MaxFloor }}
              </p>
            </td>
            <td>
              <!-- <div class="btn-group row">
                <button
                  style="width: 38px; height: 38px"
                  class="mx-2 rounded-square p-2 lh-1 btn btn-outline-primary"
                  @click="editById(demand.Id, demand)"
                >
                  <i class="bi-pencil-square"></i>
                </button>
                <button
                  style="width: 38px; height: 38px"
                  class="rounded-square p-2 lh-1 btn btn-danger"
                  @click="deleteModal = demand.Id"
                  :disabled="!demandInDeal(demand.Id)"
                >
                  <i class="bi-trash"></i>
                </button>
              </div> -->
              <div class="btn-group row">
                  <button
                  class="btn-group__item"
                  @click="editById(demand.Id, demand)"
                  >
                  Изменить
                  </button>
                  <button
                  class="btn-group__item"
                  @click="deleteModal = demand.Id"
                  :disabled="!demandInDeal(demand.Id)"
                  >
                  Удаление
                  </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ModalCreateNeed v-if="showModal" @close="showModal = false" />
    <ModalProofDelete
      v-if="deleteModal > -1"
      @close="deleteModal = -1"
      @proof="removeById(deleteModal)"
      >выбранный объект #<b>{{ deleteModal }}</b
      >?</ModalProofDelete
    >
  </section>
</template>

<script>
import { useDealsStore } from "../store/deals";
import { useDemandsStore } from "../store/demands";
import { useClientsStore } from "../store/clients";
import { useAgentsStore } from "../store/agents";

import ModalCreateNeed from "../components/ModalCreateNeed.vue";
import ModalProofDelete from "./ModalProofDelete.vue";

export default {
  components: {
    ModalCreateNeed,
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
      clients: useClientsStore().clients,
      agents: useAgentsStore().agents,
      content: {
        Type: "",
        ClientId: "",
        AgentId: "",
        MinPrice: null,
        MaxPrice: null,
        MinFloors: "",
        MaxFloors: "",
        MinRooms: "",
        MaxRooms: "",
        MinArea: "",
        MaxArea: "",
        Address_City: "",
        Address_Street: "",
        Address_House: "",
        Address_Number: "",
        MinFloor: "",
        MaxFloor: "",
      },
    };
  },
  computed: {
    filteredDemands() {
      let arr = useDemandsStore().demands;
      return arr;
    },
    isValidForm() {
      return !!this.content.AgentId & !!this.content.ClientId;
    },
  },
  methods: {
    removeById(id) {
      useDemandsStore().removeDemand(id);
    },
    editById(id, obj) {
      console.log(obj);
      this.editId = id;
      this.content.Type = obj.Type;
      this.content.ClientId = obj.ClientId;
      this.content.AgentId = obj.AgentId;
      this.content.MinPrice = obj.MinPrice;
      this.content.MaxPrice = obj.MaxPrice;
      this.content.Id = obj.Id;
      obj.Type != "apartment"
        ? (this.content.MinFloors = obj.MinFloors)
        : (this.content.MinFloors = obj.MinFloor);
      obj.Type != "apartment"
        ? (this.content.MaxFloors = obj.MaxFloors)
        : (this.content.MaxFloors = obj.MaxFloor);
      this.content.MinRooms = obj.MinRooms;
      this.content.MaxRooms = obj.MaxRooms;
      this.content.MinArea = obj.MinArea;
      this.content.MaxArea = obj.MaxArea;
      this.content.Address_City = obj.Address_City;
      this.content.Address_Street = obj.Address_Street;
      this.content.Address_House = obj.Address_House;
      this.content.Address_Number = obj.Address_Number;
    },
    saveChanges(id) {
      this.editId = -1;
      this.content.MinFloor = this.content.MinFloors;
      this.content.MaxFloor = this.content.MaxFloors;
      useDemandsStore().changeDemand(id, this.content);
      console.log(id, this.content);
    },
    cancelChanges(id) {
      this.editId = -1;
      useDemandsStore().fetchDemands();
    },
    demandInDeal(id) {
      for (let i = 0; i < useDealsStore().deals.length; i++) {
            if (useDealsStore().deals[i].Demand_Id === id) {
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

.table__wrapper {
  width: 100%;
  overflow: scroll;
}

.table {
  width: 2400px;
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
