type FlowNode = {
  id?: string;
  title?: string;
  detail?: string;
  kind?: 'start' | 'decision' | 'action' | 'end';
};

type FlowEdge = {
  from?: string;
  to?: string;
  label?: string;
};

type FlowchartData = {
  nodes?: Array<FlowNode | undefined>;
  edges?: Array<FlowEdge | undefined>;
};

export function Flowchart({ flowchart }: { flowchart?: FlowchartData }) {
  const nodes = (flowchart?.nodes ?? []).filter((node): node is FlowNode =>
    Boolean(node),
  );
  const edges = (flowchart?.edges ?? []).filter((edge): edge is FlowEdge =>
    Boolean(edge),
  );

  if (!nodes.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">
        流程图节点生成中...
      </div>
    );
  }

  const edgeMap = new Map<string, string>(
    edges.map(edge => [`${edge.from}-${edge.to}`, edge.label ?? '']),
  );

  return (
    <div className="space-y-3">
      {nodes.map((node, index) => {
        const nextNode = nodes[index + 1];
        const connectorLabel = nextNode
          ? edgeMap.get(`${node.id}-${nextNode.id}`)
          : undefined;

        return (
          <div key={node.id ?? index} className="space-y-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-glow">
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-sky-300/80">
                <span className="inline-flex rounded-full border border-sky-400/30 px-2 py-1">
                  {String(node.kind ?? '节点')}
                </span>
                <span>{node.id ?? `step-${index + 1}`}</span>
              </div>
              <div className="text-base font-semibold text-white">
                {node.title ?? '生成中'}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {node.detail ?? '正在补充流程节点说明...'}
              </p>
            </div>

            {nextNode ? (
              <div className="flex items-center gap-3 pl-4 text-xs text-slate-400">
                <div className="h-8 w-px bg-gradient-to-b from-sky-400/80 to-transparent" />
                <span>{connectorLabel ?? '继续'}</span>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
