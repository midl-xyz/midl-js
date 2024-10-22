import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

type Props = {
  packages: string[];
};

export const NPMInstall = ({ packages }: Props) => {
  const packageManagers = ["pnpm", "npm", "yarn"];
  const installCommand = {
    pnpm: "pnpm add",
    npm: "npm install",
    yarn: "yarn add",
  };

  return (
    <Tabs>
      {packageManagers.map(packageManager => (
        <TabItem
          value={packageManager}
          key={packageManager}
          label={packageManager}
        >
          <CodeBlock className="bash">
            {`${installCommand[packageManager]} ${packages.join(" ")}`}
          </CodeBlock>
        </TabItem>
      ))}
    </Tabs>
  );
};
