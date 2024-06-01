<template>
  <q-table
    flat
    :pagination="pagination"
    grid
    :rows="productStore.rowRequest"
    :columns="columns"
    row-key="id"
    separator="cell"
    :visible-columns="
      $q.screen.gt.xs
        ? ['id', 'name', 'description', 'qty', 'msrp', 'srp', 'qrcode']
        : ['id', 'name', 'description', 'qty', 'msrp', 'srp', 'qrcode']
    "
  >
    <template v-slot:item="props">
      <q-card
        :class="props.row.status == 'Request' ? 'bg-blue-3' : ''"
        class="my-card row q-mb-md q-mr-sm"
        :style="
          $q.screen.gt.lg
            ? 'width: 32%'
            : $q.screen.gt.sm
            ? 'width: 32%'
            : 'width: 47%;'
        "
      >
        <q-card-section>
          <div>
            <span class="text-bold">Description:</span> <br /><span
              v-html="props.row.description"
            ></span>
            <br />
            <span
              >Status:
              <q-chip
                class="text-white"
                :color="
                  props.row.status == 'Request'
                    ? 'blue'
                    : props.row.status == 'Order Arrived'
                    ? 'green'
                    : props.row.status == 'Order Placed'
                    ? 'blue'
                    : props.row.status == 'In Transit'
                    ? 'orange'
                    : 'red'
                "
                >{{ props.row.status }}</q-chip
              ></span
            >
          </div>
        </q-card-section>
        <q-card-actions class="q-pt-none full-width">
          <q-btn
            color="blue"
            label="edit"
            size="sm"
            v-if="props.row.status == 'Request'"
            @click="EditDialog(props.row.id)"
          />
        </q-card-actions>
      </q-card>
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td key="id" :props="props">
          {{ props.row.sku }}
        </q-td>

        <q-td key="name" :props="props">
          <q-avatar>
            <q-img
              :src="props.row.product_img"
              v-if="props.row.product_img"
              width="50px"
            />
            <q-avatar
              v-else
              color="grey"
              text-color="white"
              icon="image_not_supported"
            >
            </q-avatar>
          </q-avatar>
          {{ props.row.title }}
        </q-td>
        <q-td key="description" :props="props">
          {{ props.row.description }}
        </q-td>
        <q-td key="qty" :props="props">
          {{ props.row.qty_remaining }}
        </q-td>

        <q-td key="msrp" :props="props">
          {{ props.row.msrp }}
        </q-td>

        <q-td key="srp" :props="props">
          {{ props.row.srp }}
        </q-td>
        <q-td key="qrcode" :props="props">
          <vue-qrcode
            :value="props.row.code"
            :options="{
              errorCorrectionLevel: 'Q',
              width: 100,
            }"
            @ready="onReady"
            :id="'qrcode_canvas' + props.row.sku"
            crossorigin="anonymous"
          ></vue-qrcode
          ><br />
          <q-btn
            dense
            flat
            label="download"
            color="green"
            icon="download"
            size="sm"
            @click="downloadFunc('qrcode_canvas' + props.row.sku)"
          />
          <!-- {{ props.row.code }} -->
        </q-td>
        <q-td key="barcode" :props="props">
          <!-- <vue-barcode
            :value="props.row.code"
            :options="{ lineColor: '#007bff' }"
          ></vue-barcode> -->
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            color="blue"
            icon="edit"
            label="edit"
            size="sm"
            @click="EditDialog(props.row.id)"
          />
          <!-- <q-btn
            color="green"
            icon="bar_chart"
            size="sm"
            :to="'/user/members/' + props.row.id + '/update-photo'"
          />

          <q-btn
            color="orange"
            icon="fastfood"
            size="sm"
            :to="'/branches/' + props.row.id + '/products'"
          />
          <q-btn
            color="secondary"
            icon="shopping_cart"
            size="sm"
            @click="passwordDialog(props.row.id)"
          />

          <q-btn
            color="info"
            icon="monitor"
            size="sm"
            @click="passwordDialog(props.row.id)"
          /> -->
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <!-- Edit Product -->
  <q-dialog v-model="showEditDialog">
    <EditRequest
      :request-id="request_id"
      @hide-edit-dialog="showEditDialog = !showEditDialog"
    />
  </q-dialog>
</template>

<script setup>
import { api } from "src/boot/axios";
import { useProductDatas } from "stores/branch/productStores";
import { LocalStorage } from "quasar";
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import EditRequest from "./EditRequest.vue";
import VueQrcode from "@chenfengyuan/vue-qrcode";
// import VueBarcode from "@chenfengyuan/vue-barcode";
const description = ref("");
const route = useRoute();

const productStore = useProductDatas();

const $q = useQuasar();

const code = ref(null);

const showEditDialog = ref(false);
const showCaptureImg = ref(false);
const showPasswordDialog = ref(false);
const request_id = ref(null);

const onReady = (canvas) => {
  const context = canvas.getContext("2d");
  const image = new Image();

  // console.log(canvas);

  image.src = "https://avatars.githubusercontent.com/u/3456749";
  image.crossorigin = "anonymous";
  image.onload = () => {
    const coverage = 0.15;
    const width = Math.round(canvas.width * coverage);
    const x = (canvas.width - width) / 2;

    // drawImage(context, image, x, x, width, width);
  };
};

const drawImage = (context, image, x, y, width, height, radius = 4) => {
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 2;
  context.shadowBlur = 4;
  context.shadowColor = "#00000040";
  context.lineWidth = 8;
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
  context.strokeStyle = "#fff";
  context.stroke();
  context.clip();
  context.fillStyle = "#fff";
  context.fillRect(x, x, width, height);
  context.drawImage(image, x, x, width, height);
};

const downloadFunc = (id) => {
  // console.log(formData.code);
  var canvas = document.getElementById(id);
  // Convert the canvas to data
  var imageUrl = canvas.toDataURL();
  // Create a link
  var aDownloadLink = document.createElement("a");
  // Add the name of the file to the link
  aDownloadLink.download = id + ".png";
  // Attach the data to the link
  aDownloadLink.href = imageUrl;
  // Get the code to click the download link

  aDownloadLink.click();
};

const EditDialog = (id) => {
  request_id.value = "";
  showEditDialog.value = true;
  request_id.value = id;
};

const pagination = reactive({
  sortBy: "id",
  rowsPerPage: 0,
});
const columns = reactive([
  {
    name: "id",
    label: "SKU",
    field: "id",
    align: "left",
    sortable: true,
    classes: "bg-grey-4 text-black",
  },
  {
    name: "name",
    label: "Product Name",
    field: "name",
    align: "left",
    sortable: true,
  },

  {
    name: "description",
    label: "Description",
    field: "description",
    align: "left",
    sortable: true,
  },

  {
    name: "qty",
    label: "Qty",
    field: "qty",
    align: "left",
    sortable: true,
  },
  {
    name: "msrp",
    label: "MSRP",
    field: "msrp",
    align: "left",
    sortable: true,
  },
  {
    name: "srp",
    label: "SRP",
    field: "srp",
    align: "left",
    sortable: true,
  },
  {
    name: "qrcode",
    label: "Qrcode",
    field: "qrcode",
    align: "left",
    sortable: true,
  },

  {
    name: "barcode",
    label: "Barcode",
    field: "barcode",
    align: "left",
    sortable: true,
  },
  {
    name: "action",
    label: "Action",
    field: "action",
    align: "left",
  },
]);
onMounted(() => {
  //   branchData.getAllStaff();
  $q.loading.show();

  setTimeout(() => {
    // console.log(productStore.rowBranchProductDatas);

    $q.loading.hide();
  }, 1000);
  // if (route.params.slug) {
  //   productStore.getAllBranchProducts(route.params.slug);
  // }
});
</script>

<style></style>
