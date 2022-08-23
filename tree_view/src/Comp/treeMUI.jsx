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


//-----------------------------------------------------------------------------------------------------------
// import * as React from "react";
// import TreeView from "@mui/lab/TreeView";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import TreeItem from "@mui/lab/TreeItem";
// import { Octokit } from "@octokit/core";
// import { useState } from "react";

// const octokit = new Octokit({
//   auth: "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",
// });

// const data = {
//   id: "root",
//   name: "",
//   children: [
//     {
//       id: "Trees.pu",
//       name: "Child - 1",
//     },
//     {
//       id: "3",
//       name: "Child - 3",
//       children: [
//         {
//           id: "4",
//           name: "Child - 4",
//         },
//       ],
//     },
//   ],
// };

// export default function RichObjectTreeView() {
//   let [treeData, setTreeData] = useState();
//   let [pullRequestData, setPullRequestData] = useState([]);
//   React.useEffect(async () => {
//     let username = "octocat";

//     const repositoriesResponse = await octokit.request(
//       "GET /users/{username}/repos",
//       {
//         username,
//       }
//     );
//     if (repositoriesResponse) {
//       for (
//         let repositoryIndex = 0;
//         repositoryIndex < repositoriesResponse.data.length;
//         repositoryIndex++
//       ) {
//         const repository = repositoriesResponse.data[repositoryIndex];
//         const pullRequestsResponse = await octokit.request(
//           "GET /repos/{owner}/{repo}/pulls",
//           {
//             owner: username,
//             repo: repository.name,
//           }
//         );
//         pullRequestData = [];
//         if (pullRequestsResponse.data.length) {
//           for (
//             let pullRequestIndex = 0;
//             pullRequestIndex < pullRequestsResponse.data.length;
//             pullRequestIndex++
//           ) {
//             const pullRequest = pullRequestsResponse.data[pullRequestIndex];
//             const pullRequestFilesResponse = await octokit.request(
//               "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
//               {
//                 owner: username,
//                 repo: repository.name,
//                 pull_number: pullRequest.number,
//               }
//             );
//             setPullRequestData(
//               pullRequestData.push({
//                 ...pullRequest,
//                 files: pullRequestFilesResponse.data,
//               })
//             );
//           }
//         }
//         setTreeData(
//           treeData.push({
//             ...repository,
//             pullRequests: pullRequestData,
//           })
//         );
//       }
//     }

//     ////return treeData;
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
//       <div>This is data</div>
//       {renderTree({
//         id: "root",
//         name: "SANIANJUM",
//         children: [
//           {
//             id: treeData.id,  
//             name: treeData.name,   
//             children: [
//               {
//                 id: pullRequestData.pull_number,  
//                 name: pullRequestData.title, 
// //another children with same id and sha value.
//                 children: [
//                     {
//                       id: "",  
//                       name: pullRequestData.sha,           
//                     },
//                   ],          
//               },
//             ],
//           },
//         ],
//       })}
//     </TreeView>
//   );
// }


//------------------------------------------------------------------------------------

/*
import * as React from "react";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { useEffect, useState } from "react";
import { Octokit } from "@octokit/core";

const octokit = new Octokit({
  auth: "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",
});

export default function RichObjectTreeView() {
  let [treeData, setTreeData] = useState(
    {
        name: 'Sania Repository',
        id: 'root',
        children: [ // List of Repository
            {
                name: 'Treeview',
                id: '1',
                children: [  // List of Pull Requests
                    {
                        name: 'Pull request 1',
                        id: 'pl-1',
                        children: [ // List of Files
                            {
                                name: 'File 1',
                                id: 'fl-1'
                            },
                            {
                                name: 'File 2',
                                id: 'fl-2'
                            },
                            {
                                name: 'File 3',
                                id: 'fl-3'
                            },
                        ]
                    },
                    {
                        name: 'Pull request 2',
                        id: 'pl-2',
                        children: [ // List of Files
                            {
                                name: 'File 4',
                                id: 'fl-4'
                            },
                            {
                                name: 'File 5',
                                id: 'fl-5'
                            },
                            {
                                name: 'File 6',
                                id: 'fl-6'
                            },
                        ]
                    },
                ]
            },
            {
                name: 'TreeDemo',
                id: '2',
                children: [  // List of Pull Requests
                    {
                        name: 'Pull request 3',
                        id: 'pl-3',
                        children: [ // List of Files
                            {
                                name: 'File 7',
                                id: 'fl-7'
                            },
                            {
                                name: 'File 8',
                                id: 'fl-8'
                            },
                            {
                                name: 'File 9',
                                id: 'fl-9'
                            },
                        ]
                    },
                    {
                        name: 'Pull request 4',
                        id: 'pl-4',
                        children: [ // List of Files
                            {
                                name: 'File 10',
                                id: 'fl-10'
                            },
                            {
                                name: 'File 11',
                                id: 'fl-11'
                            },
                            {
                                name: 'File 12',
                                id: 'fl-12'
                            },
                        ]
                    },
                ]
            }
        ]
    }
    // {
    //   id: "root",
    //   name: "Parent",
    //   children: [],
    // },
  );
  let [pullRequestData, setPullRequestData] = useState([
    {
      id: "",
      name: "",
      children: [],
    },
  ]);
  let username = "SANIANJUM";

  useEffect(() => {
    (async () => {
      const repositoriesResponse = await octokit.request("GET /user/repos");
      //console.log(treeData);
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
          console.log(pullRequestsResponse);
          pullRequestData = [
            {
              id: pullRequestsResponse.data.id, // check here
              name: pullRequestsResponse.data.node_id, // number
              children: [],
            },
          ];
          if (pullRequestsResponse.data.length) {
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
              //console.log(pullRequestsResponse);
              const inVal = pullRequestsResponse.data.map((y) => ({
                id: y.sha, // y.sha
                name: y.title, // y.filename
                children: pullRequestFilesResponse.data,
              }));
              //setPullRequestData([...pullRequest, ...inVal]);
              //   setPullRequestData(
              //     pullRequestData.push({
              //       ...pullRequest,
              //       files: pullRequestFilesResponse.data,
              //     })
              //   );
            }
          }

          //console.log(repositoriesResponse);
          const val = repositoriesResponse.data.map((x) => ({
            id: x.id.toString(),
            name: x.name,
            children: [],
          }));
          //setTreeData([...treeData, ...val]);
        }
      }
      //setData(data);
    })();
  }, []);

  const data = {
    id: "root",
    name: username,
    children: [
      {
        id: "1",
        name: "Child - 1",
      },
      {
        id: "3",
        name: "Child - 3",
        children: [
          {
            id: "4",
            name: "Child - 4",
          },
        ],
      },
    ],
  };

  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

//   const renderTree = (nodes) =>{
//     return (<TreeItem key={node.id} nodeId={node.id} label={node.name}>
//         {Array.isArray(node.children)
//           ? node.children.map((node) => renderTree(node))
//           : null}
//       </TreeItem>)
//   }
    // nodes.map((node) => {
      //return (
        // <TreeItem key={node.id} nodeId={node.id} label={node.name}>
        //   {Array.isArray(node.children)
        //     ? node.children.map((node) => renderTree(node))
        //     : null}
        // </TreeItem>
      //);
    //}
    //);

  return (
    <TreeView
      aria-label="rich object"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={["root"]}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
    >
      {renderTree(treeData)}
      {/* //{treeData} */
    //}
      //</TreeView>
      //);
   // }





//------------------------------Getting repos displayed, pulls of public in console, and pull files-------------------------------------------------------------------------------------

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
//       //console.log(treeData);
//       if (repositoriesResponse) {
//         for (
//           let repositoryIndex = 0;
//           repositoryIndex < repositoriesResponse.data.length;
//           repositoryIndex++
//         ) {
//           const repository = repositoriesResponse.data[repositoryIndex];
//           console.log(repository);
//           const pullRequestsResponse = await octokit.request(
//             "GET /repos/{owner}/{repo}/pulls",
//             {
//               owner: username,
//               repo: repository.name,
//             }
//           );
//           console.log(pullRequestsResponse);
//           pullRequestData = [
//             {
//               id: pullRequestsResponse.data.id, // check here
//               name: pullRequestsResponse.data.node_id, // number
//               children: [],
//             },
//           ];
//           if (pullRequestsResponse.data.length) {
//             for (
//               let pullRequestIndex = 0;
//               pullRequestIndex < pullRequestsResponse.data.length;
//               pullRequestIndex++
//             ) {
//               const pullRequest = pullRequestsResponse.data[pullRequestIndex];
//               const pullRequestFilesResponse = await octokit.request(
//                 "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
//                 {
//                   owner: username,
//                   repo: repository.name,
//                   pull_number: pullRequest.number,
//                 }
//               );
//               //console.log(pullRequestsResponse);
//               setPullRequestData.children = pullRequestsResponse.data.map((y) => ({
//                 id: y.sha, // y.sha
//                 name: y.title, // y.filename
//                 children: pullRequestFilesResponse.data,
//               }));
//               setPullRequestData([...pullRequest]);    //,...inval
//                 // setPullRequestData(
//                 //   pullRequestData.push({
//                 //     ...pullRequest,
//                 //     files: pullRequestFilesResponse.data,
//                 //   })
//                 // );
//             }
//           }

//           //console.log(repositoriesResponse);
//         //   const val = repositoriesResponse.data.map((x) => ({
//         //     id: x.id.toString(),
//         //     name: x.name,
//         //     children: [],
//         //   }));
//           treeData.children = repositoriesResponse.data.map((x) => ({
//             id: x.id.toString(),
//             name: x.name,
//             children: [],
//           }));
//           //console.log(treeData);
//           //console.log(repositoriesResponse);
//           setTreeData([...treeData]);  ///  ,...val
//         }
//       }
//       //setData(data);
//     })();
//   }, []);


//   const renderTree = (nodes) => (
//     <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
//       {Array.isArray(nodes.children)
//         ? nodes.children.map((node) => renderTree(node))
//         : null}
//     </TreeItem>
//   );

// //   const renderTree = (nodes) =>{
// //     return (<TreeItem key={node.id} nodeId={node.id} label={node.name}>
// //         {Array.isArray(node.children)
// //           ? node.children.map((node) => renderTree(node))
// //           : null}
// //       </TreeItem>)
// //   }
//     // nodes.map((node) => {
//       //return (
//         // <TreeItem key={node.id} nodeId={node.id} label={node.name}>
//         //   {Array.isArray(node.children)
//         //     ? node.children.map((node) => renderTree(node))
//         //     : null}
//         // </TreeItem>
//       //);
//     //}
//     //);

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
