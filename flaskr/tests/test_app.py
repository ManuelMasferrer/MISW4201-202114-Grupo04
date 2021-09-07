import os
import tempfile

import pytest
from flask import json

from ..app import app, db, Cancion

@pytest.fixture
def client():
    print(app)
    db_fd, app.config['DATABASE'] = tempfile.mkstemp()
    app.config['TESTING'] = True

    with app.test_client() as client:
        with app.app_context():
            db.init_app(app)
            db.create_all()
        yield client

    os.close(db_fd)
    os.unlink(app.config['DATABASE'])

def test_cancion_a_favorito(client):
    nueva_cancion = Cancion(
            titulo="test",
            minutos="10",
            segundos="30",
            interprete="Test interprete",
            es_favorita=False
            )
    db.session.add(nueva_cancion)
    db.session.commit()

    rv = client.put('/cancion/'+str(nueva_cancion.id)+'/change_favorite_state')
    json_data = json.loads(rv.data)
    assert json_data['es_favorita'] ==  True

def test_quitar_favorito_a_cancion(client):
    nueva_cancion = Cancion(
            titulo="test",
            minutos="10",
            segundos="30",
            interprete="Test interprete",
            es_favorita=True
            )
    db.session.add(nueva_cancion)
    db.session.commit()

    rv = client.put('/cancion/'+str(nueva_cancion.id)+'/change_favorite_state')
    json_data = json.loads(rv.data)
    assert json_data['es_favorita'] == False
