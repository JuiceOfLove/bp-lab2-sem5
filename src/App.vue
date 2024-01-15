<template>
  <Header />
  <router-view></router-view>
</template>
<script>
import Header from './components/Header.vue';
import "bootstrap-icons/font/bootstrap-icons.css";

import { useClientsStore } from './store/clients';
import { useAgentsStore } from './store/agents';
import { useObjectsStore } from './store/objects';
import { useDemandsStore } from './store/demands';
import { useSuppliesStore } from './store/supplies';
import { useDealsStore } from './store/deals';
import { useMobileStore } from './store/mobile';

export default {
  components: {
    Header
},
  setup() {
    const clientsStore = useClientsStore()
    clientsStore.fetchClients()
    const agentsStore = useAgentsStore()
    agentsStore.fetchAgents()
    const objectsStore = useObjectsStore()
    objectsStore.fetchObjects()
    const demandsStore = useDemandsStore()
    demandsStore.fetchDemands()
    const suppliesStore = useSuppliesStore()
    suppliesStore.fetchSupplies()
    const dealsStore = useDealsStore()
    dealsStore.fetchDeals()
    const mobileStore = useMobileStore()
    mobileStore.fetchMobile()
    return {
      clients: clientsStore.clients,
      agents: agentsStore.agents,
      objects: objectsStore.objects,
      demands: demandsStore.demands,
      supplies: suppliesStore.supplies,
      deals: dealsStore.deals,
      mobile: mobileStore.mobile,
    }
  },
}
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
  * {
    font-family: "Montserrat", sans-serif;

    tr:nth-of-type(2n+1) {
      tbody {
        .table-striped {
          --bs-table-bg-type: white;
        }
      }
    }
  }

  table {
    width: 100%;
    margin-bottom: 20px;
    border: 1px solid #dddddd;
    border-collapse: collapse; 
}

table th {
  font-weight: bold;
  padding: 5px;
  background: #efefef;
  border: 1px solid #dddddd;
}

table tbody tr:nth-child(even){

  background: #efefef;

}

table td {
  border: 1px solid #dddddd;
  padding: 5px;
}

input[type='number'] {
    -moz-appearance: textfield;
}

.btn-group__item {
  padding: 0;
  border: none;
  font: inherit;
  color: inherit;
  background-color: transparent;
  cursor: pointer;

  &:disabled {
    opacity: .4;
    cursor: default;
  }

  .modal {
    backdrop-filter: none;
  }

  .btn {
    background-color: #0A99C3;
  }

}

</style>
