<template>
  <section class="agents">
    <div class="agents__wrapper p-4">
      <div class="table-title d-flex justify-content-between mb-3">
        <h3 class="d-inline-flex">Риэлторы</h3>
        <div class="d-flex flex-row">
          <form class="me-3" role="search">
          <input
            v-model="search"
            type="search"
            class="form-control"
            placeholder="Поиск риэлторов"
            aria-label="Search"
          />
        </form>
        <button
          type="button"
          @click="showModal = true"
          class="d-inline-flex align-items-center btn px-4 nav-pills"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          style="background-color: #74aa0e; color: white; border: gray;"
        >
          Добавить риэлтора
        </button>
        </div>
      </div>
      <div v-if="editId > -1" @submit.prevent="onSubmit" class="modal">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content p-2">
            <div class="modal-body row d-flex g-2">
              <div class="modal-header">
                <h5 class="modal-title fw-bold mb-0 fs-4">
                  Редактировать риэлтора
                </h5>
                <button
                  type="button"
                  class="btn btn-close"
                  @click="cancelChanges"
                ></button>
              </div>
              <div class="modal-body row g-2">
                <div class="form-floating">
                  <input
                    v-model="content.MiddleName"
                    class="form-control rounded-3"
                    id="MiddleName"
                  />
                  <label for="MiddleName">Фамилия</label>
                </div>
                <div class="form-floating">
                  <input
                    v-model="content.FirstName"
                    id="FirstName"
                    class="form-control rounded-3"
                  />
                  <label for="FirstName">Имя</label>
                </div>
                <div class="form-floating">
                  <input
                    id="LastName"
                    v-model="content.LastName"
                    class="form-control rounded-3"
                  />
                  <label for="LastName">Отчество</label>
                </div>
                <div class="form-floating">
                  <input
                    id="Phone"
                    v-model="content.DealShare"
                    type="number"
                    class="form-control rounded-3"
                  />
                  <label for="Phone">Комиссия</label>
                </div>
                <div
                  class="form-floating align-self-end d-flex justify-content-end"
                >
                  <button
                    @click="cancelChanges"
                    class="w-40 mx-2 btn btn-secondary nav-pills"
                  >
                    Отменить изменения
                  </button>
                  <button
                    class="w-40 mx-2 btn btn-primary nav-pills"
                    @click="saveChanges(editId)"
                    :disabled="!isValidForm"
                  >
                    Сохранить изменения
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
            <th scope="col" class="table__item">Имя</th>
            <th scope="col" class="table__item">Фамилия</th>
            <th scope="col" class="table__item">Отчество</th>
            <th scope="col" class="table__item">Комиссия</th>
            <th scope="col" class="table__item">Действия</th>
          </tr>
        </thead>
        <tbody class="table-hover">
          <tr
            v-for="agent in filteredAgents"
            :key="agent.Id"
            :class="{ 'table-info': agent.Id == editId }"
          >
            <th scope="row" class="table__item">
              <p class="table__input" :disabled="this.editId !== agent.Id">
                {{ agent.Id }}
              </p>
            </th>
            <td class="table__item">
              <p class="table__input" :disabled="this.editId !== agent.Id">
                {{ agent.FirstName }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input" :disabled="this.editId !== agent.Id">
                {{ agent.MiddleName }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input" :disabled="this.editId !== agent.Id">
                {{ agent.LastName }}
              </p>
            </td>
            <td class="table__item">
              <p class="table__input" :disabled="this.editId !== agent.Id">
                {{ agent.DealShare }}
              </p>
            </td>
            <td class="table__item px-3">
              <div class="btn-group row">
                <button
                  class="btn-group__item"
                  @click="openModal = agent.Id"
                >
                  Участие
                </button>
                <button
                  class="btn-group__item"
                  @click="editById(agent.Id, agent)"
                >
                  Изменить
                </button>
                <button
                  class="btn-group__item"
                  @click="deleteModal = agent.Id"
                  :disabled="
                    checkId(agent.Id, this.supplies) ||
                    checkId(agent.Id, this.demands)
                  "
                >
                  Удалить
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ModalCreateAgent v-if="showModal" @close="showModal = false" />
    <ModalOpen
      v-if="openModal > -1"
      :id="openModal"
      @close="openModal = -1"
      type="agent"
    />
    <ModalProofDelete
      v-if="deleteModal > -1"
      @close="deleteModal = -1"
      @proof="removeById(deleteModal)"
      >выбранного риэлтора #<b>{{ deleteModal }}</b
      >?</ModalProofDelete
    >
  </section>
</template>

<script>
import { useAgentsStore } from "../store/agents";
import levenshteinDistance from "../levenshtein.js";
import { useDemandsStore } from "../store/demands";
import { useSuppliesStore } from "../store/supplies";

import ModalCreateAgent from "../components/ModalCreateAgent.vue";
import ModalOpen from "../components/ModalOpen.vue";
import ModalProofDelete from "./ModalProofDelete.vue";

export default {
  components: {
    ModalCreateAgent,
    ModalOpen,
    ModalProofDelete,
  },
  data() {
    return {
      editId: -1,
      showModal: false,
      openModal: -1,
      deleteModal: -1,
      search: "",
      demands: useDemandsStore().demands,
      supplies: useSuppliesStore().supplies,
      content: {
        FirstName: "",
        LastName: "",
        MiddleName: "",
        DealShare: "",
        Id: 0,
      },
    };
  },
  computed: {
    filteredAgents() {
      if (this.search !== "") {
        const searchWords = this.search.toLowerCase().split(" ");
        return useAgentsStore().agents.filter((agent) => {
          const fullName =
            `${agent.FirstName} ${agent.MiddleName} ${agent.LastName}`.toLowerCase();

          // Check if any part of the full name is a fuzzy match for any search word
          return searchWords.some(
            (word) =>
              this.isFuzzyMatch(agent.FirstName.toLowerCase(), word) ||
              this.isFuzzyMatch(agent.MiddleName.toLowerCase(), word) ||
              this.isFuzzyMatch(agent.LastName.toLowerCase(), word)
          );
        });
      }
      return useAgentsStore().agents;
    },
    isValidForm() {
      return (
        !!this.content.FirstName &
        !!this.content.LastName &
        !!this.content.MiddleName
      );
    },
  },
  methods: {
    isFuzzyMatch(str1, str2) {
      const distance = levenshteinDistance(str1, str2);
      return distance <= 3;
    },
    removeById(id) {
      useAgentsStore().removeAgent(id);
    },
    editById(id, obj) {
      this.editId = id;
      this.content.FirstName = obj.FirstName;
      this.content.LastName = obj.LastName;
      this.content.MiddleName = obj.MiddleName;
      this.content.DealShare = obj.DealShare;
      this.content.Id = obj.Id;
    },
    saveChanges(id) {
      this.editId = -1;
      useAgentsStore().changeAgent(id, this.content);
      console.log(id, this.content);
    },
    cancelChanges(id) {
      this.editId = -1;
      this.agents = dataAgents;
    },
    checkId(id, array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].AgentId === id) {
          return true;
        }
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.agents__wrapper {
  padding: 0 40px;
  max-width: 1400px;
  margin: 0 auto;
}
.table__item {
  font-size: 18px;
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

.btn-group {
  display: flex;
  flex-direction: column;
}

.clients__wrapper {
    padding: 0 20px;
    max-width: 1440px;
    margin: 0 auto;
}

.row.g-2 {
    margin-bottom: 20px;
}

.btn-group__item:hover {
  background-color: rgb(72, 125, 217);
  color: #ffffff;
  width: 98%;
  border-radius: 15px;
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
