// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { BsTrash, BsCheck } from 'react-icons/bs';
import { v4 as uuidv4 } from 'uuid';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

const shops = [
  { id: 1, name: 'Migros' },
  { id: 2, name: 'Teknosa' },
  { id: 3, name: 'BİM' },
];

const categories = [
  { id: 1, name: 'Elektronik' },
  { id: 2, name: 'Şarküteri' },
  { id: 3, name: 'Oyuncak' },
  { id: 4, name: 'Bakliyat' },
  { id: 5, name: 'Fırın' },
];

const ShoppingList = () => {
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [products, setProducts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isShoppingCompleted, setIsShoppingCompleted] = useState(false);

  // Filtreleme için yeni state'ler
  const [filteredShopId, setFilteredShopId] = useState('all');
  const [filteredCategoryId, setFilteredCategoryId] = useState('all');
  const [filteredStatus, setFilteredStatus] = useState('all');
  const [filteredName, setFilteredName] = useState('');

  // Eklenen kısım
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fuzzy search için yeni state
  // eslint-disable-next-line no-unused-vars
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddProduct = () => {
    if (selectedMarket && selectedCategory && productName) {
      const newProduct = {
        id: uuidv4(),
        market: selectedMarket,
        category: selectedCategory,
        name: productName,
        isBought: false,
      };
      setProducts([...products, newProduct]);
      // Ürün eklenince state'i sıfırla
      setSelectedMarket('');
      setSelectedCategory('');
      setProductName('');
    } else {
      alert('Lütfen tüm alanları doldurun.');
    }
  };

  const handleBuyProduct = (productId) => {
    const updatedProducts = products.map((product) =>
      product.id === productId ? { ...product, isBought: true } : product
    );
    setProducts(updatedProducts);
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter((product) => product.id !== productId);
    setProducts(updatedProducts);
  };

  useEffect(() => {
    // Her products statei güncellendiğinde çalışacak fonksiyon
    const isAllBought = products.every((product) => product.isBought);
    setIsShoppingCompleted(products.length > 0 && isAllBought);
  }, [products]);

  // Eklenen kısım
  useEffect(() => {
    // Filtreleme işlemini burada yapalım
    const filtered = products.filter((product) => {
      const isMarketMatch = filteredShopId == 'all' || product.market == parseInt(filteredShopId);
      const isCategoryMatch = filteredCategoryId == 'all' || product.category == parseInt(filteredCategoryId);
      const isStatusMatch = filteredStatus == 'all' || (filteredStatus == 'bought' && product.isBought) || (filteredStatus == 'notBought' && !product.isBought);
      const isProductNameMatch = !filteredName || product.name.toLowerCase().includes(filteredName.toLowerCase());

      return isMarketMatch && isCategoryMatch && isStatusMatch && isProductNameMatch;
    });

    setFilteredProducts(filtered);
  }, [filteredShopId, filteredCategoryId, filteredStatus, filteredName, products]);

  // Fuzzy search işlemi
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredProducts(filtered);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, products]);

  return (
    <Container>
      <Row>
        <Col>
          <h2>Alışveriş Listesi</h2>
          <Form>
            <Form.Group controlId="market">
              <Form.Label>Market</Form.Label>
              <Form.Control as="select" value={selectedMarket} onChange={(e) => setSelectedMarket(e.target.value)}>
                <option value="">Market Seçiniz</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Kategori</Form.Label>
              <Form.Control as="select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Kategori Seçiniz</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="productName">
              <Form.Label>Ürün Adı</Form.Label>
              <Form.Control type="text" placeholder="Ürün Adı" value={productName} onChange={(e) => setProductName(e.target.value)} />
            </Form.Group>
            <Button variant="primary" onClick={handleAddProduct}>
              Ürün Ekle
            </Button>
          </Form>
        </Col>
        <Col>
          <h2>Alışveriş Listesi</h2>
          {/* Filtreleme için input */}
          <Form.Group controlId="filterMarket">
            <Form.Label>Market Filtrele</Form.Label>
            <Form.Control as="select" value={filteredShopId} onChange={(e) => setFilteredShopId(e.target.value)}>
              <option value="all">Tümü</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="filterCategory">
            <Form.Label>Kategori Filtrele</Form.Label>
            <Form.Control as="select" value={filteredCategoryId} onChange={(e) => setFilteredCategoryId(e.target.value)}>
              <option value="all">Tümü</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="filterStatus">
            <Form.Label>Durum Filtrele</Form.Label>
            <Form.Control as="select" value={filteredStatus} onChange={(e) => setFilteredStatus(e.target.value)}>
              <option value="all">Tümü</option>
              <option value="bought">Satın Alınanlar</option>
              <option value="notBought">Satın Alınmayanlar</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="filterProductName">
            <Form.Label>Ürün Adına Göre Filtrele</Form.Label>
            <Form.Control type="text" placeholder="Ürün adını yazın" value={filteredName} onChange={(e) => setFilteredName(e.target.value)} />
          </Form.Group>
          {/* Filtreleme butonu */}
          
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Ürün Adı</th>
                <th>Market</th>
                <th>Kategori</th>
                <th>Satın Alındı</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} style={{ textDecoration: product.isBought ? 'line-through' : 'none' }}>
                  <td>{product.name}</td>
                  <td>
                    {shops.find((shop) => shop.id == product.market)?.name || 'Market Bulunamadı'}
                  </td>
                  <td>
                    {categories.find((category) => category.id == product.category)?.name || 'Kategori Bulunamadı'}
                  </td>
                  <td>
                    {!product.isBought && (
                      <Button variant="success" onClick={() => handleBuyProduct(product.id)}>
                        <BsCheck />
                      </Button>
                    )}
                  </td>
                  <td>
                    <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>
                      <BsTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default ShoppingList;
