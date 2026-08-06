import { useProtocoloStore, FakeSale } from '@/lib/protocolo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, Zap } from 'lucide-react';
import { useState } from 'react';

export const ProtocoloPanel = () => {
  const { enabled, setEnabled, sales, addSale, removeSale, overrides, setOverride } = useProtocoloStore();
  const [newSale, setNewSale] = useState<Omit<FakeSale, 'id'>>({
    produto: 'Plano VIP',
    valor: 'R$ 497,00',
    nome_cliente: 'João Silva',
    atraso: 5
  });

  const handleAddSale = () => {
    addSale(newSale);
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Módulo Protocolo
          </CardTitle>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure notificações de vendas simuladas e overrides de dashboard.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vendas Fake</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Produto</Label>
                <Input value={newSale.produto} onChange={e => setNewSale({...newSale, produto: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Valor</Label>
                <Input value={newSale.valor} onChange={e => setNewSale({...newSale, valor: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Input value={newSale.nome_cliente} onChange={e => setNewSale({...newSale, nome_cliente: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Atraso (s)</Label>
                <Input type="number" value={newSale.atraso} onChange={e => setNewSale({...newSale, atraso: Number(e.target.value)})} />
              </div>
            </div>
            <Button onClick={handleAddSale} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Adicionar Notificação
            </Button>

            <div className="mt-4 space-y-2">
              {sales.map(sale => (
                <div key={sale.id} className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm">
                  <span>{sale.nome_cliente} - {sale.valor}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeSale(sale.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dashboard Overrides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Total de Vendas Exibido</Label>
              <Input 
                placeholder="Ex: R$ 15.420,00" 
                value={overrides.totalVendas || ''} 
                onChange={e => setOverride('totalVendas', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Projetos Concluidos Exibido</Label>
              <Input 
                placeholder="Ex: 124" 
                value={overrides.projetosConcluidos || ''} 
                onChange={e => setOverride('projetosConcluidos', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
