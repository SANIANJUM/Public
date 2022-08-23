import * as React from "react";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { useEffect, useState } from "react";
import { Octokit } from "@octokit/core";
import TreeNewLink from './treeNewLink';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';

const octokit = new Octokit({
  auth: "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",
});

export default function RichObjectTreeView() {
  let [treeData, setTreeData] = useState({
    name: "Sania Repository",
    id: "root",
    url: "",
    children: [],
  });
  let [pullRequestData, setPullRequestData] = useState({
    id: "",
    name: "",
    url: "",
    children: [],
  });
  let [fileData, setFileData] = useState({
    id: "",
    name: "",
    url: "",
  });
  let username = "SANIANJUM";

  useEffect(() => {
    setTreeData('Loading');
    (async () => {
      const arr = [];
      const repositoriesResponse = await octokit.request("GET /user/repos");
      if (repositoriesResponse) {
        for (
          let repositoryIndex = 0;
          repositoryIndex < repositoriesResponse.data.length;
          repositoryIndex++
        ) {
          const repository = repositoriesResponse.data[repositoryIndex];
          const pullRequestsResponse = await octokit.request(
            "GET /repos/{owner}/{repo}/pulls",
            {
              owner: username,
              repo: repository.name,
            }
          );
          pullRequestData = {
            id: "",
            name: "",
            url: "",
            children: [],
          };

          if (pullRequestsResponse.data.length) {
            const arrpull = [];
            for (
              let pullRequestIndex = 0;
              pullRequestIndex < pullRequestsResponse.data.length;
              pullRequestIndex++
            ) {
              const pullRequest = pullRequestsResponse.data[pullRequestIndex];
              const pullRequestFilesResponse = await octokit.request(
                "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
                {
                  owner: username,
                  repo: repository.name,
                  pull_number: pullRequest.number,
                }
              );
              fileData = {
                id: "",
                name: "",
                url: "",
              };
              if (pullRequestFilesResponse) {
                const arrfile = [];
                for (
                  let fileIndex = 0;
                  fileIndex < pullRequestFilesResponse.data.length;
                  fileIndex++
                ) {
                  const res = pullRequestFilesResponse.data[fileIndex];
                  //const lnk = URL.createObjectURL(res.blob_url);
                  const url= res.blob_url;
                  const result = res.name;
                  const nameF= <span> {`${result}`} </span>;
                  arrfile.push(
                    res
                      ? {
                          id: res.sha,
                          name: <a href={url}>{nameF}</a>,
                        }
                      : null
                  );
                  // fileData = {
                  //   id: res.blob_url,
                  //   name: res.filename,
                  // };
                  //arrfile.push(fileData ? fileData : { id: "", name: "" });
                }
                arrpull.push({
                  id: pullRequest.id,
                  name: pullRequest.node_id,
                  url:"",
                  children: arrfile,
                });
              }
            }
            arr.push({
              id: repository.id,
              name: repository.name,
              url:"",
              children: arrpull,
            });
          }
        }
        setTreeData({
          id: "root",
          name: "SANIANJUM",
          url:"",
          children: arr,
        });
      }
    })();
  }, []);

  const renderTree = (nodes) => (

    
    //<a href="https://github.com/SANIANJUM">
      <TreeItem
    key={nodes.id}
    nodeId={nodes.id}
    label={nodes.name}
    url={nodes.url}
  >
    {Array.isArray(nodes.children)
      ? nodes.children.map((node) => renderTree(node))
      : null}
  </TreeItem>
  //</a>
  );

  return (
    <TreeView
      aria-label="rich object"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={["root"]}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
    >
      {renderTree(treeData)}
      {/* //{treeData} */}
    </TreeView>
  );
}

//-------------------------------------------------------------------------------------------------------------------

// import * as React from "react";
// import TreeView from "@mui/lab/TreeView";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import TreeItem from "@mui/lab/TreeItem";
// import { useEffect, useState } from "react";
// import { Octokit } from "@octokit/core";

// const octokit = new Octokit({
//   auth: "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",
// });

// export default function RichObjectTreeView() {
//     let count=0;
//   let [treeData, setTreeData] = useState(
//     {
//         name: 'Sania Repository',
//         id: 'root',
//         children: [ ]
//     }
//   );
//   let [pullRequestData, setPullRequestData] = useState(
//     {
//       id: "",
//       name: "",
//       children: [ ],
//     },
//   );

//   let username = "SANIANJUM";

//   useEffect(() => {
//     (async () => {
//       const repositoriesResponse = await octokit.request("GET /user/repos");
//       if (repositoriesResponse) {
//         for (
//           let repositoryIndex = 0;
//           repositoryIndex < repositoriesResponse.data.length;
//           repositoryIndex++
//         ) {
//           const repository = repositoriesResponse.data[repositoryIndex];
//           const pullRequestsResponse = await octokit.request(
//             "GET /repos/{owner}/{repo}/pulls",
//             {
//               owner: username,
//               repo: repository.name,
//             }
//           );
//           console.log("12345");
//           console.log(pullRequestsResponse);
//           pullRequestData =
//             {
//               id: "", // check here
//               name: "", // number
//               children: [],
//             };

//             //console.log(pullRequestData);

//           if (pullRequestsResponse.data.length) {
//             for (
//               let pullRequestIndex = 0;
//               pullRequestIndex < pullRequestsResponse.data.length;
//               pullRequestIndex++
//             ) {
//                 let arr=[];
//               const pullRequest = pullRequestsResponse.data[pullRequestIndex];
//               const pullRequestFilesResponse = await octokit.request(
//                 "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
//                 {
//                   owner: username,
//                   repo: repository.name,
//                   pull_number: pullRequest.number,
//                 }
//               );
//               console.log(pullRequestFilesResponse);
//               //setPullRequestData.children = pullRequestsResponse.data.map((y) => ({
//                 //add file for loop

//                 if(pullRequestFilesResponse){
//                     for(let fileIndex =0; fileIndex<pullRequestFilesResponse.data.length; fileIndex++){
//                         const res= pullRequestFilesResponse.data[fileIndex];
//                         console.log((count++) +"filename:   "+res.blob_url);
//                         arr.push(res.blob_url);
//                     }
//                 }
//                 console.log("arr :   "+arr);
//               pullRequestData = pullRequestsResponse.data.map((y) => ({
//                 id: y.id, // y.sha
//                 name: y.node_id, // y.node_id
//                 children: arr, //pullFiles
//               }));
//               console.log(pullRequestData);
//               setPullRequestData({pullRequestData});    //setPullRequestData([...pullRequestData]);

//             }
//           }
//           treeData.children = repositoriesResponse.data.map((x) => ({
//             id: x.id.toString(),
//             name: x.name,
//             children: [pullRequestData],
//           }));

//           console.log(treeData);
//           setTreeData({treeData});  ///  setTreeData([...treeData]);
//         }
//       }
//     })();
//   }, []);

//   const renderTree = (nodes) => (
//     <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
//       {Array.isArray(nodes.children)
//         ? nodes.children.map((node) => renderTree(node))
//         : null}
//     </TreeItem>
//   );

//   return (
//     <TreeView
//       aria-label="rich object"
//       defaultCollapseIcon={<ExpandMoreIcon />}
//       defaultExpanded={["root"]}
//       defaultExpandIcon={<ChevronRightIcon />}
//       sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
//     >
//       {renderTree(treeData)}
//       {/* //{treeData} */}
//     </TreeView>
//   );
// }
