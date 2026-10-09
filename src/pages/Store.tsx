import { useStore } from '../store/useStore';
import { ShoppingBag, Check } from 'lucide-react';
import clsx from 'clsx';
import './Store.css';

export function Store() {
    const currentUser = useStore((state) => state.currentUser);
    const buyItem = useStore((state) => state.buyItem);
    const storeItems = useStore((state) => state.storeItems);

    const handleBuy = (itemId: string, cost: number) => {
        if (confirm(`Are you sure you want to spend ${cost} CP?`)) {
            const success = buyItem(itemId, cost);
            if (success) {
                alert('Purchase successful!');
            } else {
                alert('Not enough CP!');
            }
        }
    };

    return (
        <div className="store-container">
            <div className="store-header">
                <h1 className="store-title">CP Store</h1>
                <p className="store-subtitle">Spend your Currency Points on exclusive profile customizations</p>
                <div className="wallet-display">
                    <span className="cp-icon">CP</span>
                    <span className="cp-amount">{currentUser.cp_balance}</span>
                </div>
            </div>

            <div className="store-grid">
                {storeItems.map((item) => {
                    const isOwned = false; // TODO: Check if user owns item
                    const canAfford = currentUser.cp_balance >= item.cost;

                    return (
                        <div key={item.id} className="store-item-card">
                            <div className="item-preview">
                                <img src={item.preview_url} alt={item.name} className="item-image" />
                                <span className="item-type-badge">{item.type}</span>
                            </div>
                            <div className="item-details">
                                <h3 className="item-name">{item.name}</h3>
                                <p className="item-description">{item.description}</p>
                                <div className="item-footer">
                                    <div className="item-cost">
                                        <span>{item.cost}</span>
                                        <span>CP</span>
                                    </div>
                                    <button
                                        onClick={() => handleBuy(item.id, item.cost)}
                                        disabled={!canAfford || isOwned}
                                        className={clsx('buy-btn', isOwned && 'owned')}
                                    >
                                        {isOwned ? (
                                            <>
                                                <Check className="w-4 h-4 mr-1" />
                                                Owned
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingBag className="w-4 h-4 mr-1" />
                                                Buy
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
