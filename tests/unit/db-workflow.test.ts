import {
  NODE_ID_TO_DB_ID,
  DB_ID_TO_NODE_ID,
} from "../../lib/db/workflow-repository";

function testDBWorkflowMapping() {
  console.log("=== Running Unit Tests: Database Schema Workflow Mapping ===");

  // Test 1: Validate DB IDs range 1 to 19 for all 19 nodes
  const nodeCount = Object.keys(NODE_ID_TO_DB_ID).length;
  if (nodeCount !== 19) {
    throw new Error(`Expected 19 node mappings, got ${nodeCount}`);
  }
  console.log("✔ Test 1: 19 DB ID node mappings PASSED");

  // Test 2: Bi-directional mapping check
  if (NODE_ID_TO_DB_ID["node_1_1"] !== 1 || DB_ID_TO_NODE_ID[1] !== "node_1_1") {
    throw new Error("Mapping failure for node_1_1 -> DB ID 1");
  }
  if (NODE_ID_TO_DB_ID["node_4_2"] !== 19 || DB_ID_TO_NODE_ID[19] !== "node_4_2") {
    throw new Error("Mapping failure for node_4_2 -> DB ID 19");
  }
  console.log("✔ Test 2: Bi-directional node_1_1 (1) to node_4_2 (19) mapping PASSED");

  console.log("=== All DB Workflow Mapping Tests Passed Successfully ===");
}

testDBWorkflowMapping();
